import { useEffect, useState } from "react"
import axios from "axios"
import { useSearchParams } from 'react-router-dom';
export default function Address(){
    const [formStep,setFormStep]=useState(1)
    const [formaValues,addFormaValues]=useState({})
    const [addressValues,addAddressValues]=useState([])
    const [noOfelement,setNoOfelement]=useState([1])
    const [searchParams,setSearchParam] = useSearchParams();
    const email=searchParams.get('email')
    const addAddress=()=>{
        if(noOfelement.length<3){
            setNoOfelement([...noOfelement,1])
            if(formaValues){
                addAddressValues([...addressValues,formaValues])
            }
            addFormaValues()
        }
    }
    const handler=(e)=>{
        const {name,value}=e.target;
        addFormaValues({...formaValues,[name]:value})
    }
    const submitAddress=(e)=>{
        if(formaValues){
            addAddressValues([...addressValues,formaValues])
        }
        addFormaValues()
        console.log(addressValues) 
        updateAddress();
    }

    const updateAddress=async ()=>{
        await axios.post('http://127.0.0.1:8000/update',{
            email:email,
            address:JSON.stringify(addressValues)
           }).then(res=>{
               if(res.data){
                  window.location.href='/thankyou'
               }
           })
    }
    useEffect(()=>{
       
        console.log(searchParams,email); 
    },[])
    // use
    return(
        <div>
            <div class="offset-lg-2 col-lg-8 offset-md-1 col-md-10 col-12 text-center">
                <div class="formpart">
                    <form action="">
                    {formStep==1 &&
                    <div id="slide03">
                        <h3>Do you have a Previous Address?</h3>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                        <label onClick={()=>{setFormStep(2)}} class="form-check-label next02" for="flexRadioDefault1">
                            Yes
                        </label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                        <label class="form-check-label tothank" for="flexRadioDefault2">
                            No
                        </label>
                        </div>
                    </div>
                    }
                    
                    
                    {formStep==2 &&
                    <div id="slide04" style={{display:formStep==1?'none':'block'}}>
                        <h3>Enter your Previous Address</h3>
                        <div class="mb-3 text-start">
                        {noOfelement.map((address,key) => (
                            <div key={key}>
                            <label class="form-label">Previous Address {key+1}</label>
                            <input onChange={handler} name="address1" type="text" class="form-control mb-3" id="" placeholder="Address line 1" />
                            <input onChange={handler} name="address2" type="text" class="form-control mb-3" id="" placeholder="Address line 2" />
                            <input onChange={handler} name="address3" type="text" class="form-control mb-3" id="" placeholder="Address line 3" />
                            </div>
                        ))}
                        </div>
                        
                        <div class="mb-3 text-center" id="submitoradd01">
                            <button onClick={submitAddress} type="button" class="btn btn-success tothank">Submit</button>
                            <p>{noOfelement.length<3 && <a href="#" onClick={addAddress} id="showadrs2">Add Another Address</a>}</p>
                            <p><a href="#" onClick={(e)=>{setFormStep(1)}} id="back02">  Back </a></p>
                        </div> 
                    </div>}
                    </form>
                </div>
            </div>
        </div>
    )
}