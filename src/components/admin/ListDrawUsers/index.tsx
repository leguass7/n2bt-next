import { useCallback, useEffect, useMemo, useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import styled from 'styled-components'

import { useAppTheme } from '~/components/AppThemeProvider/useAppTheme'
import { stringAvatar } from '~/helpers/string'
import { useIsMounted } from '~/hooks/useIsMounted'
import { IUser } from '~/server-side/useCases/user/user.dto'

type Data = IUser & { passing?: boolean }

interface Props {
  initialData: Data[]
  debounce?: number
  times?: number
  winner?: string
  onSuccess?: () => void
}

let time = 0

export const ListDrawUsers: React.FC<Props> = ({ initialData = [], debounce = 500, times = 10, winner, onSuccess }) => {
  const { theme } = useAppTheme()
  const isMounted = useIsMounted()
  const [data, setData] = useState<Data[]>(initialData)
  const [changing, setChanging] = useState(0)

  const changePassing = useCallback(
    (i = 0, length: number) => {
      if (!isMounted()) return null

      const index = i % length
      const nextIndex = index + 1 === length ? 0 : index + 1

      setData(old => {
        const newArray = [...old]
        newArray[index].passing = false
        newArray[nextIndex].passing = true

        return newArray
      })

      return index
    },
    [isMounted]
  )

  const length = useMemo(() => {
    return data?.length || 0
  }, [data])

  const winnerInfo = useMemo(() => {
    if (changing === 2) return data.find(({ passing = false }) => !!passing)
  }, [changing, data])

  const handleDraw = useCallback(() => {
    if (!winner || !length) return null
    setChanging(1)

    for (let i = 0; i < times; i++) {
      time += 200
      setTimeout(() => {
        changePassing(i, length)
      }, debounce + time)
    }

    setTimeout(() => {
      setChanging(2)
      onSuccess?.()
    }, debounce + time + 1000)

    time = 0
  }, [winner, changePassing, times, debounce, length, onSuccess])

  useEffect(() => {
    handleDraw()
  }, [winner, handleDraw])

  if (changing === 2) {
    return (
      <ItemContainer>
        <Avatar className="winner" sx={{ bgcolor: theme.colors.info, height: 72, width: 72 }} src={winnerInfo?.image} alt={winnerInfo?.name}>
          {stringAvatar(winnerInfo?.name)}
        </Avatar>
        <Typography align="center" py={1}>{`${winnerInfo?.name?.split?.(' ')[0] || ''} ${winnerInfo?.name?.split?.(' ')[1] || ''}`}</Typography>
        <Typography variant="h5" align="center">
          Vencedor
        </Typography>
      </ItemContainer>
    )
  }

  return (
    <ListContainer>
      {data?.length
        ? data.map(({ id, name, image, passing }) => {
            return (
              <ItemContainer key={`user-${id}`}>
                <Avatar className={passing && 'passing'} sx={{ bgcolor: theme.colors.info, height: 64, width: 64 }} src={image} alt={name}>
                  {stringAvatar(name)}
                </Avatar>
                <Typography py={1}>{`${name.split(' ')[0] || ''} ${name.split(' ')[1] || ''}`}</Typography>
              </ItemContainer>
            )
          })
        : null}
    </ListContainer>
  )
}

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: stretch;
  align-items: stretch;
  width: 100%;
`

const ItemContainer = styled.div`
  width: calc(100% / 3);
  display: flex;
  padding: 4px;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;

  .passing {
    border: solid 2px #fff;
  }

  .winner {
    border: solid 3px #c6ff00;
  }
`
