import styled from 'styled-components'

export const ImagePreview = styled.img`
  display: block;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

export const DropZoneContainer = styled.div`
  display: block;
  width: 100%;
  max-width: 100%;
  border: 2px dashed #fff;
  border-radius: 6px;
  margin: 0 auto;
  position: relative;
  padding: 10px;
`

export const ImageContainer = styled.div`
  display: block;
  position: relative;
  width: 345px;
  max-width: 100%;
  min-height: 194px;
  border: 0;
  margin: 0 auto;
  overflow: hidden;
`
