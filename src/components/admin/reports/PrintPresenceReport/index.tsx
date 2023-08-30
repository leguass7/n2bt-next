import React, { useCallback, useEffect, useMemo, useState } from 'react'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import { Divider, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'

import { limitString } from '~/helpers/string'
import { type IResponseSubscriptions } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { adminReportSubscriptions } from '~/services/api/subscriptions'

import { Span } from '../styles'

const theme = createTheme({
  typography: {
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      borderBottom: '2px solid black',
      padding: '4px 10px'
    }
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        body: {
          borderBottom: '1px solid #000',
          padding: '4px 6px'
        }
      }
    }
  }
})

type Props = {
  tournamentId: number
}

export const PrintPresenceReport: React.FC<Props> = ({ tournamentId }) => {
  const [data, setData] = useState<IResponseSubscriptions['subscriptions']>([])

  const fetchData = useCallback(async () => {
    const response = await adminReportSubscriptions(tournamentId)
    if (response.success) {
      setData(response?.subscriptions || [])
    }
  }, [tournamentId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const subs = useMemo(() => {
    return data.reduce((acc, item) => {
      const found = acc.find(sub => sub?.user?.id === item?.user?.id)
      if (!found) acc.push(item)

      return acc
    }, [] as IResponseSubscriptions['subscriptions'])
  }, [data])

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ width: '21cm', maxWidth: '100%' }}>
        <Typography variant="h2">Relatório de inscrições</Typography>
        <Divider />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 300 }}>Nome</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subs.map(({ id, user, payment: _ }, i) => {
                // const paiday = tryDate(payment?.payday as Date)
                return (
                  <TableRow key={`sub-${id}`}>
                    <TableCell>
                      <Span textSize={14}>
                        <Span textSize={10} textStyle="italic">
                          #{i + 1}
                        </Span>{' '}
                        {limitString(user?.name, 32)}
                      </Span>
                      <br />

                      <Span textSize={12}>{user?.email}</Span>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction={'row'} spacing={2}>
                        {user?.gender?.toLowerCase() === 'f' ? <FemaleIcon fontSize="small" /> : <MaleIcon fontSize="small" />}
                        <Span style={{ minWidth: '32px' }}>{user?.shirtSize}</Span>
                        <CheckBoxOutlineBlankIcon />
                      </Stack>
                    </TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </ThemeProvider>
  )
}
