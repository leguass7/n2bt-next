import React, { useCallback, useState } from 'react'
import { type FileRejection, useDropzone } from 'react-dropzone'
import Resizer from 'react-image-file-resizer'
import { toast } from 'react-toastify'

import { Button, Stack, LinearProgress } from '@mui/material'

import { usePassRoll } from '~/components/PassRollLayout'
import { useOnceCall } from '~/hooks/useOnceCall'
import { apiService } from '~/services/api/api.service'
import { getImageFromFeature } from '~/services/api/image'

import { DropZoneContainer, ImageContainer, ImagePreview } from './styles'

const maxSize = 1024 * 500
function resizeFile(file: File) {
  return new Promise(resolve => {
    Resizer.imageFileResizer(file, 345, 194, 'JPEG', 95, 0, uri => resolve(uri), 'file', 345, 194)
  })
}

// import { Container } from './styles';
type Props = {
  tournamentId: number
  onCancel?: () => void
}

export const UploadImage: React.FC<Props> = ({ tournamentId, onCancel }) => {
  const { goTo } = usePassRoll('form-tournament')
  const [srcPreview, setSrcPreview] = useState<string>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)
  const [image, setImage] = useState<string>(null)
  const [loading, setLoading] = useState(false)

  const processUpload = useCallback(
    async (file: File) => {
      const data = new FormData()
      const resizedFile = (await resizeFile(file)) as File

      data.append('file', resizedFile, `${tournamentId}-${file.name}.${file.name.split('.')[1]}`)

      const response = await apiService.uploadXMLHttp(`/upload/tournament/${tournamentId}`, data, p => setProgress(p))

      if (response?.success) {
        setProgress(0)
        setError(false)
      } else {
        setError(true)
      }
    },
    [tournamentId]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const [file] = acceptedFiles
      if (file) {
        setError(false)
        setSrcPreview(URL.createObjectURL(file))
        processUpload(file)
      }
      if (fileRejections?.length) {
        const rejections = fileRejections.map(f => f.file?.name).join(',')
        toast.error(`Arquivo não permitido ${rejections}`)
      }
    },
    [processUpload]
  )

  const { getRootProps, getInputProps, inputRef } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: false,
    maxSize,
    disabled: !!loading
  })

  const fetchData = useCallback(async () => {
    if (!tournamentId) return null
    setLoading(true)
    const { success, images } = await getImageFromFeature('tournament', tournamentId)
    setLoading(false)
    if (success && images?.length) setImage(images[0]?.url)
  }, [tournamentId])

  useOnceCall(fetchData)

  // 345x194
  const handleClickBack = () => goTo(1)

  const cancelEnabled = !progress || !!error

  const imageSrc = srcPreview || image

  return (
    <div>
      <DropZoneContainer {...getRootProps()}>
        <ImageContainer>
          {imageSrc ? <ImagePreview src={imageSrc} /> : null}
          <input ref={inputRef} {...getInputProps()} />
        </ImageContainer>
      </DropZoneContainer>
      <LinearProgress
        sx={{ visibility: progress ? 'visible' : 'hidden', mt: 1 }}
        color={error ? 'error' : 'success'}
        variant="determinate"
        value={progress}
      />
      <Stack direction="row" justifyContent="center" spacing={1} pt={2} pb={2}>
        {onCancel ? (
          <Button color="primary" variant="outlined" type="button" disabled={!cancelEnabled} onClick={onCancel}>
            {'Cancelar'}
          </Button>
        ) : null}
        <Button color="primary" variant="outlined" type="button" onClick={handleClickBack}>
          {'voltar'}
        </Button>
      </Stack>
    </div>
  )
}
