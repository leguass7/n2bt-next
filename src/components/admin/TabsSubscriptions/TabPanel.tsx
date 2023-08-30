import React, { useCallback, useState } from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import SummarizeIcon from '@mui/icons-material/Summarize'
import { CardContent, Modal, Card, CardHeader, Divider } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'

import { type FetchHandler, TableSubscriptions } from '~/components/admin/TableSubscriptions'
import { BoxCenter, Paragraph, Text } from '~/components/styled'
import { formatPrice } from '~/helpers'

type Summary = {
  value: number
  count: number
  total: number
}
type TabPanelProps = {
  tournamentId: number
  categoryId: number
  categoryName: string
  index: number
  value: number
}
export const TabPanel: React.FC<TabPanelProps> = ({ value, index, categoryId, categoryName, tournamentId }) => {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [summaryData, setSummaryData] = useState<Summary[]>([])
  const { push } = useRouter()

  const onFetchData: FetchHandler = useCallback(data => {
    const total = data.reduce((acc, d) => (acc += d?.value || 0), 0)
    const summary: Summary[] = []
    data.forEach(d => {
      const found = summary.find(f => f.value === d.value)
      if (found) {
        found.count += 1
        found.total += d?.value || 0
        found.value = d?.value || 0
      } else {
        summary.push({
          count: 1,
          total: d?.value || 0,
          value: d?.value || 0
        })
      }
    })

    setAmount(total)
    setSummaryData(summary)
  }, [])

  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`}>
      {value === index && (
        <Card sx={{ overflowX: 'auto', maxWidth: '100%' }}>
          <CardHeader
            title={`Inscrições - ${categoryName}`}
            subheader={formatPrice(amount)}
            action={
              <Toolbar sx={{ justifyContent: 'flex-end' }}>
                <IconButton onClick={() => setOpen(true)}>
                  <SummarizeIcon />
                </IconButton>
                <Tooltip title="Voltar para torneios" arrow>
                  <IconButton size="large" onClick={() => push('/admin/tournaments')}>
                    <ArrowBackIcon />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            }
          />
          <Divider />
          <TableSubscriptions categoryId={categoryId} tournamentId={tournamentId} onFetchData={onFetchData} />
        </Card>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <BoxCenter>
          <Card>
            <CardHeader
              title="Resumo"
              subheader={categoryName}
              action={
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Paragraph>
                {summaryData?.map(d => {
                  return (
                    <Text key={`k-${d.value}`}>
                      <Text>{d.count}</Text> x <Text>{formatPrice(d.value)}</Text> = <Text>{formatPrice(d.total)}</Text>
                      <br />
                    </Text>
                  )
                })}
                <br />
                <Text bold>Total:</Text> <Text>{formatPrice(amount)}</Text>
              </Paragraph>
            </CardContent>
          </Card>
        </BoxCenter>
      </Modal>
    </div>
  )
}
