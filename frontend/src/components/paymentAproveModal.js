import React from 'react'
import { useDispatch,useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updateGdStatus, detailsOrder} from '../actions/orderAction';
import MessageBox  from './messageBox';
import LoadingBox from './loading'
import { paymentAproval } from '../actions/orderAction';
const PaymentAproveModal = (props) => {
    const dispatch=useDispatch()
    
//     const orderGdUpdate=useSelector((state)=>state.oredergdupdate)
//    const {success,loading,error,order}=orderGdUpdate
    console.log('props',props)
    const dshow=true
    const _id=props._id
    const closeModal=()=> {
        console.log('clicked me')
        props.closeModalPyement()
    }
   const updateUprove=()=>{
          props.updatedOrderAprove()
              }


    const save=async()=> {
        await dispatch(paymentAproval({_id}))
        updateUprove()
        closeModal()
    }


  return (
    
    <Modal  show={dshow} onHide={closeModal}>
    <Modal.Header closeButton>
      <Modal.Title style={{paddingLeft:'90px'}}><i className='icon fa fa-exclamation-triangle' style={{color:'yellow'}}></i></Modal.Title>
      {/* {loading && <LoadingBox></LoadingBox>}
    {error && <MessageBox variant="danger">{error}</MessageBox>}
    {success && <MessageBox variant="success">{success}</MessageBox>} */}
    </Modal.Header>
    <Modal.Body style={{paddingLeft:'50px'}}>
    
    <h2><strong>Are You Sure?</strong></h2>
    <h4 style={{texAlign:'center'}}>Have you Paied? ?</h4>

    </Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={closeModal}>
        Close
      </Button>
      <Button variant="primary" onClick={save}>
        Approve
      </Button>
    </Modal.Footer>
  </Modal>








  )
}


export default PaymentAproveModal