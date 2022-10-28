import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import styled from 'styled-components'

interface Props {
  title?: string
  open: boolean
  onToggle?: () => void
  children: React.ReactNode
}

export const SimpleModal: React.FC<Props> = ({ children, title = '', open = false, onToggle }) => {
  return (
    <Modal open={open} onClose={onToggle}>
      <ModalContainer>
        <PaperContainer>
          <ModalHeader>
            <Typography variant="h5">{title}</Typography>
            <IconButton disableRipple onClick={onToggle}>
              <CloseIcon />
            </IconButton>
          </ModalHeader>
          <div>{children}</div>
        </PaperContainer>
      </ModalContainer>
    </Modal>
  )
}

const ModalContainer = styled.div`
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  outline: none;
  max-width: 600px;
`

const ModalHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  overflow: hidden;
  padding: 4px;
`

const PaperContainer = styled(Paper)`
  width: 100%;
  max-height: 100%;
  padding: 10px 20px 20px 20px;
  overflow: auto;
`
