import React, { useCallback, useEffect, useMemo, useState } from 'react'

import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import FemaleIcon from '@mui/icons-material/Female'
import MaleIcon from '@mui/icons-material/Male'
import { Divider, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import Typography from '@mui/material/Typography'

import { formatPrice } from '~/helpers'
import { splitDateTime, tryDate } from '~/helpers/dates'
import { limitString } from '~/helpers/string'
import { type IResponseSubscriptions } from '~/server-side/useCases/subscriptions/subscriptions.dto'
import { adminReportSubscriptions } from '~/services/api/subscriptions'

import { FlexBox, Span } from '../styles'

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

export const PrintReport: React.FC<Props> = ({ tournamentId }) => {
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

  const [totalPaid, totalUnpaid, totalPromoPaid] = useMemo(() => {
    //
    return data.reduce(
      ([a, b, c], { payment }) => {
        a += !!payment?.paid ? payment?.value || 0 : 0
        b += !payment?.paid ? payment?.value || 0 : 0
        c += payment?.promoCode ? payment?.value || 0 : 0

        return [a, b, c]
      },
      [0, 0, 0]
    )
  }, [data])

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ width: '21cm', maxWidth: '100%' }}>
        <Typography variant="h2">Relatório de inscrições</Typography>
        <div style={{ maxWidth: '100%', padding: '12px 12px' }}>
          <FlexBox gap={8} wrap="wrap">
            <Span>
              Inscrições: <Span bold>{data?.length}</Span>
            </Span>
            <Span>
              Total pago: <Span bold>{formatPrice(totalPaid)}</Span>
            </Span>
            <Span>
              À receber: <Span bold>{formatPrice(totalUnpaid)}</Span>
            </Span>
            <Span>
              Com código: <Span bold>{formatPrice(totalPromoPaid)}</Span>
            </Span>
          </FlexBox>
        </div>
        <Divider />
        <Divider />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell align="center"> </TableCell>
                <TableCell align="center">Tamanho</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell align="center">Pago</TableCell>
                <TableCell>Promo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map(({ id, user, payment, category }, i) => {
                const paiday = tryDate(payment?.payday as Date)
                return (
                  <TableRow key={`sub-${id}`}>
                    <TableCell>
                      <Span textSize={14}>
                        <Span textSize={10} textStyle="italic">
                          #{i + 1}
                        </Span>{' '}
                        {limitString(user?.name, 32)} ({category?.title?.trim()})
                      </Span>
                      <br />
                      <Span textSize={12}>{user?.email}</Span>
                    </TableCell>
                    <TableCell align="center">
                      {user?.gender?.toLowerCase() === 'f' ? <FemaleIcon fontSize="small" /> : <MaleIcon fontSize="small" />}
                    </TableCell>
                    <TableCell align="center">{user?.shirtSize}</TableCell>
                    <TableCell align="right">
                      <Span textSize={10}>{formatPrice(payment?.value || 0)}</Span>
                      {paiday ? (
                        <>
                          <br />
                          <Span textSize={10}>{splitDateTime(paiday)?.[0]}</Span>
                        </>
                      ) : null}
                    </TableCell>
                    <TableCell align="center">
                      <>{payment?.paid ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}</>
                    </TableCell>
                    <TableCell>
                      <Span textSize={10}>{payment?.promoCode?.code}</Span>
                      <br />
                      <Span textSize={10} textStyle="italic">
                        {payment?.promoCode?.label}
                      </Span>
                    </TableCell>
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
