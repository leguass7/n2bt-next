// import React, { useCallback } from 'react'
// import SweetAlert, { SweetAlertProps } from 'react-bootstrap-sweetalert'

// import { CircleLoading } from '~/components/CircleLoading'

// import { useTableActions } from '.'

// const Alert: React.FC<SweetAlertProps> = (props: SweetAlertProps) => <SweetAlert {...props} />

// export const MessageDelete: React.FC = () => {
//   const { showDelete, hideDeleteMessage, deleting } = useTableActions()

//   const handleConfirm = useCallback(async () => {
//     if (showDelete?.onConfirm) {
//       await showDelete.onConfirm()
//     }
//   }, [showDelete])

//   return (
//     <>
//       {showDelete && !deleting && (
//         <Alert
//           title={showDelete?.title}
//           type={showDelete?.type || 'danger'}
//           showCloseButton
//           showCancel
//           allowEscape
//           cancelBtnText="CANCELAR"
//           showConfirm={!!showDelete?.onConfirm}
//           onConfirm={handleConfirm}
//           onCancel={hideDeleteMessage}
//         >
//           {showDelete?.message && <p>{showDelete.message}</p>}
//         </Alert>
//       )}
//       {deleting && (
//         <Alert title={'Removendo'} type={'info'} showCloseButton showConfirm={false} onConfirm={() => null}>
//           <div style={{ minHeight: 100 }}>
//             <CircleLoading parentRelativate light />
//           </div>
//         </Alert>
//       )}
//     </>
//   )
// }
export {}
