import React, {useEffect,useState } from 'react';
import {useSelector, useDispatch } from 'react-redux';
//import { useNavigate } from "react-router-dom";

import { saveShippingAddress } from '../../actions/cartAction';
import { listCustomerData } from '../../actions/customerAction';

import CheckoutSteps from '../CheckoutSteps';
import { useHistory } from "react-router-dom";

 const CustomerOrderInfo = (props) => {

      const dispatch = useDispatch();
      const history=useHistory()
      const customerLists = useSelector((state) => state.customerlist);
      const { customers} = customerLists;
      let customerName=[]
       if(customers) {
        for(var i=0;i<customers.length;i++)
        {
        
        customerName.push(customers[i].firstName)
        }
  
       }
      
       
            useEffect(()=> {
              console.log('4')
              dispatch(listCustomerData())
              
              },[dispatch])
   
 
  
        // const cart = useSelector((state) => state.cart);
      //  const { customerAddress } = cart;
     
    const [_id,setId]=useState('')
    const [fullName,setFullName]=useState('')
    const [phoneNumber,setPhoneNumber]=useState('')
    const [homeNumber,setHomeNumber]=useState('')
    const [email,setEmail]=useState('')
    const [tinNum,setTinNumber]=useState('')
    const [address,setAddress]=useState('')
    const [streetAdress,setStreetAddress]=useState('')
    const [companyName,setCompanyName]=useState('')
    const [payment,setPayment]=useState('')
    


    //const navigate = useNavigate();
    const filteredCustemer=(e)=> {
    
            const splitedFirstName=e.split(' ')[0]
            const splitedLastName=e.split(' ')[1]
            const filteredData=customers.filter((custemeor) => (custemeor.firstName===splitedFirstName && custemeor.lastName===splitedLastName) );
           setId(filteredData[0]._id)  
           setFullName(e)
           setPhoneNumber(filteredData[0].phoneNumber)
           setHomeNumber(filteredData[0].homeNumber)
           setEmail(filteredData[0].email)
           setTinNumber(filteredData[0].tinNum)
           setAddress(filteredData[0].address)
           setStreetAddress(filteredData[0].streetAdress)
           setCompanyName(filteredData[0].companyName)
    }
    
    const submitHandler = (e) => {
      e.preventDefault();
    dispatch(saveShippingAddress({fullName,phoneNumber,homeNumber,
      email,tinNum,address,streetAdress,companyName,_id,payment}))

       history.push('/order');
    
    
    };
      
  return (

   <div className='createStock'>
         <CheckoutSteps step1></CheckoutSteps>

         

         <div className="card shadow-sm">
        <div className="card-body">
               
      <form onSubmit={submitHandler}>
            <div className='row'>
            <div className="col-md-4">
          <label htmlFor="code" className="form-label">
              Full Name
          </label>
              {customers && 
                <select className="form-select form-control" onChange={(e) => filteredCustemer(e.target.value)}>
                <option value="" style={{fontFamily: "Times New Roman, Times, serif"}} > Select Customer Full Adreess</option>
               {customers.map((option, index) => {
                   return <option key={index} >
                   {option.firstName} {option.lastName} 
                   </option>
                 })}


         </select>

              }
        </div>

        <div className="col-md-4">
          <label htmlFor="code" className="form-label">
             Pyment Status
          </label>
           
                <select className="form-select form-control" onChange={(e) => setPayment(e.target.value)}>
                <option value="" style={{fontFamily: "Times New Roman, Times, serif"}} >---choose--</option>
             
                <option value="cash">cash</option>
                <option value="credit">credit</option>
                  
                
              


         </select>

              
        </div>















      {/* <div className="col-md-4">
        <label htmlFor="phonenumber" className="form-label">phone Number</label>
        <input
          
          className="form-control py-2"
          type="text"
          id="phonenumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        ></input>
      </div> */}
      {/* <div className="col-md-4">
        <label htmlFor="address" className="form-label">Full Address</label>
        <input
          
          className="form-control py-2"
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></input>
      </div> */}
                 

             </div>

     <br></br>

     <div className='row'>
     

      {/* <div className="col-md-4">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          
          className="form-control py-2"
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div> */}


      {/* <div className="col-md-4">
        <label htmlFor="email" className="form-label">Home Phone Number</label>
        <input
          
          className="form-control py-2"
          type="text"
          id="email"
          value={homeNumber}
          onChange={(e) => setHomeNumber(e.target.value)}
        ></input>
      </div> */}
      {/* <div className="col-md-4">
        <label htmlFor="remark" className="form-label">Street Address</label>
        <input
          
          className="form-control py-2"
          type="text"
          id="stadress"
          value={streetAdress}
          onChange={(e) => setStreetAddress(e.target.value)}
        ></input>
      </div> */}

      </div>
 
      <br></br>
     <div className='row'>
    
      
      {/* <div className="col-md-4">
        <label htmlFor="remark" className="form-label">Tin Number</label>
        <input
          
          className="form-control py-2"
          type="text"
          id="tinnum"
          value={tinNum}
          onChange={(e) => setTinNumber(e.target.value)}
        ></input>
      </div> */}

      {/* <div className="col-md-4">
        <label htmlFor="cname" className="form-label">Companey Name</label>
        <input
        
          className="form-control py-2"
          type="text"
          id="cname"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        ></input>
      </div> */}

      <div className='col-md-2' style={{marginLeft:"60px"}}>
              <div className="grid y-2" >
          <button className="btn btn-primary block b">continue</button>
        </div>
</div>
      
</div>

<div className='row'>
<div className='col-md-2'>
              <div className="grid y-2" style={{marginTop:"50px"}}>
          
        </div>


</div>
  
</div>




 </form>

        </div>
        </div>







   </div>

  );
};
export default CustomerOrderInfo;
