import React, { useState } from 'react'

import Switch from '@mui/material/Switch'
import Link from 'next/link'

import type { ICustomCellProps } from '~/components/CustomTable'
import { Text } from '~/components/styled'
import { CellContainer } from '~/components/tables/cells/styles'
import { splitDateTime } from '~/helpers/dates'
import type { ITournament } from '~/server-side/useCases/tournament/tournament.dto'
import { updateTournament } from '~/services/api/tournament'

type Props = ICustomCellProps<ITournament>

export const SwitchCell: React.FC<Props> = ({ record }) => {
  const [checked, setChecked] = useState(!!record?.published)

  const save = async (published: boolean) => {
    await updateTournament(record?.id, { published })
  }

  const handleChange = (evt: any, chk?: boolean) => {
    setChecked(!!chk)
    save(!!chk)
  }

  return (
    <CellContainer>
      <Switch checked={checked} onChange={handleChange} />
    </CellContainer>
  )
}

export const NameCell: React.FC<Props> = ({ record }) => {
  const href = `/admin/tournament/${record?.id}`

  return (
    <CellContainer>
      <Link href={href}>{record?.title}</Link>
    </CellContainer>
  )
}

export const DateCell: React.FC<Props> = ({ record }) => {
  const [date = '--', time = '--'] = record?.createdAt ? splitDateTime(record?.createdAt ? `${record?.createdAt}` : null) : '--'
  return (
    <CellContainer>
      <Text textSize={14}>{date}</Text>
      <br />
      <Text textSize={12}>{time}</Text>
    </CellContainer>
  )
}

// export const ActionCell: React.FC<Props> = ({ record }) => {
//   const { setCustom } = useTableActions<ITournamentActions>()

//   const handleDelete = () => setCustom({ deleteId: record?.id })
//   const handleEdit = () => setCustom({ editId: record?.id })

//   return (
//     <CellContainer>
//       <CellTools>
//         {/* <Tooltip title={'Remover'} arrow> */}
//         <IconButton size="small" onClick={handleDelete} disabled>
//           <DeleteIcon />
//         </IconButton>
//         {/* </Tooltip> */}
//         <Tooltip title={'editar'} arrow>
//           <IconButton size="medium" onClick={handleEdit}>
//             <EditIcon />
//           </IconButton>
//         </Tooltip>
//       </CellTools>
//     </CellContainer>
//   )
// }
