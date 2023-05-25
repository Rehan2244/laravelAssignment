import {useState,useEffect} from 'react'
import axios from 'axios'
import {browserName, isMobile} from 'react-device-detect';
import { Route } from 'react-router-dom';
export default function Register(){
   const [ip,setIP]=useState(0);
   const [browser,setBrowser]=useState('');
   const [userAgent,setUserAgent]=useState('');
   const [deviceType,setDeviceType]=useState('');
   const [formErrors,setFormErrors]=useState({});
   const [formStep,setFormStep]=useState(1);
   const [formValues,setFomrValues]=useState({})
   const [isValid,setValid]=useState(false)
   const getData = async()=>{
      const res = await axios.get('https://geolocation-db.com/json/')
      // console.log(res.data);
      setIP(res.data.IPv4)
  }

  const checkBrowser=async ()=>{
     var sBrowser, sUsrAg = navigator.userAgent;

     // The order matters here, and this may report false positives for unlisted browsers.

     if (sUsrAg.indexOf("Firefox") > -1) {
        sBrowser = "Mozilla Firefox";
        // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
     } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
        sBrowser = "Samsung Internet";
        // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
     } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
        sBrowser = "Opera";
        // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
     } else if (sUsrAg.indexOf("Trident") > -1) {
        sBrowser = "Microsoft Internet Explorer";
        // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
     } else if (sUsrAg.indexOf("Edge") > -1) {
        sBrowser = "Microsoft Edge";
        // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
     } else if (sUsrAg.indexOf("Chrome") > -1) {
        sBrowser = "Google Chrome or Chromium";
        // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
     } else if (sUsrAg.indexOf("Safari") > -1) {
        sBrowser = "Apple Safari";
        // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
     } else {
        sBrowser = "unknown";
     }
     await getData();
     setBrowser(sBrowser);
     setUserAgent(sUsrAg);
     return sBrowser;
  }
  const validateForm=async ()=>{
   //   e.preventDefault();
   const date=new Date(formValues.dobYear+'/'+formValues.dobMonth+'/'+formValues.dobDay)
   let newDate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
   // console.log(newDate)
   // return
     await axios.post('http://127.0.0.1:8000/insert',{
      fname:formValues.f_name,
      lname:formValues.l_name,
      dob:newDate+' 10:10:10',
      email:formValues.email,
      phone:formValues.phoneNumber
     }).then(res=>{
         if(res.data){
            window.location.href='/updateAddress?email='+formValues.email
         }
     })
  }
  const validateEmail=()=>{
   const regex=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
   if(regex.test(formValues.email)){
      return false;
   } else {
      return true;
   }
  }
  const validateStep=(e)=>{
   e.preventDefault();
   if(formStep==1){
      if(!formValues.f_name){
         alert('Enter first name')
      } else if(!formValues.l_name){
         alert('Enter last name')
      } else if(!formValues.dobDay || !formValues.dobMonth || !formValues.dobYear){
         alert('select date of birth')
      } else {
         setFormStep(2)
      }
   } else {
      if(!formValues.email){
         alert('Please enter email')
      } else if (validateEmail()){
         alert('Please enter valid email')
      } else if (!formValues.phoneNumber){
         alert('Enter mobile number')
      } else if (formValues.phoneNumber.length<10){
         alert('Enter valid mobile number')
      } else {
         validateForm()
      }
   }
  }
  const handleChange=(e)=>{
     const {name,value}=e.target;
   setFomrValues({...formValues,[name]:value})
  }
  const restrictLetter=(e)=>{
   const re = /[0-9A-F:]+/g;
    if (!re.test(e.key)) {
      e.preventDefault();
    }
  }
   useEffect(()=>{
      if(isMobile){
         setDeviceType('Mobile')
      } else {
         setDeviceType('PC')
      }
      checkBrowser();
   },[])
    return (
        <>
         <div className="container">
            <div className="row">
               <div className="offset-lg-2 col-lg-8 offset-md-1 col-md-10 col-12 text-center">
                  <div className="formpart">
                     <form onSubmit={validateForm}>
                        <div id="slide01">
                           <h3>Enter Your Personal Details</h3>
                           <div className="mb-3 text-start">
                              <label for="FormControlInput1" className="form-label">First Name</label>
                              <input onChange={handleChange} name="f_name" type="text" className="form-control" id="FormControlInput1" placeholder="First Name" />
                           </div>
                           <div className="mb-3 text-start">
                              <label for="FormControlInput2" className="form-label">Last Name</label>
                              <input onChange={handleChange} type="text" name="l_name" className="form-control" id="FormControlInput2" placeholder="Last Name" />
                           </div>
                           <div className="mb-3 text-start">
                              <label for="FormControlInput3" className="form-label">Enter Your Date of Birth</label>
                              <fieldset>
                                 <legend> Date Of Birth</legend>
                                 <div className="row" style={{display:'flex'}}>
                                    <div className="form-group col-lg-4 col-md-4 col-sm-4 col-12 rowItem ">
                                       <select onChange={handleChange} name="dobDay" id="lstDobDay" className="form-control watermark">
                                             <option value="">Day </option>
                                             <option value="1">1</option>
                                             <option value="2">2</option>
                                             <option value="3">3</option>
                                             <option value="4">4</option>
                                             <option value="5">5</option>
                                             <option value="6">6</option>
                                             <option value="7">7</option>
                                             <option value="8">8</option>
                                             <option value="9">9</option>
                                             <option value="10">10</option>
                                             <option value="11">11</option>
                                             <option value="12">12</option>
                                             <option value="13">13</option>
                                             <option value="14">14</option>
                                             <option value="15">15</option>
                                             <option value="16">16</option>
                                             <option value="17">17</option>
                                             <option value="18">18</option>
                                             <option value="19">19</option>
                                             <option value="20">20</option>
                                             <option value="21">21</option>
                                             <option value="22">22</option>
                                             <option value="23">23</option>
                                             <option value="24">24</option>
                                             <option value="25">25</option>
                                             <option value="26">26</option>
                                             <option value="27">27</option>
                                             <option value="28">28</option>
                                             <option value="29">29</option>
                                             <option value="30">30</option>
                                             <option value="31">31</option>
                                          </select>
                                       <i className="validate " aria-hidden="true" style={{display:'none'}}></i>
                                       <span id="dobDay_err" className="error_msg error"></span>
                                    </div>
                                    <div className="form-group col-lg-4 col-md-4 col-sm-4 col-12 rowItem">
                                       <select onChange={handleChange} name="dobMonth" id="lstDobMonth" className="form-control watermark">
                                          <option value="">Month </option>
                                          <option value="1">January</option>
                                          <option value="2">February</option>
                                          <option value="3">March</option>
                                          <option value="4">April</option>
                                          <option value="5">May</option>
                                          <option value="6">June</option>
                                          <option value="7">July</option>
                                          <option value="8">August</option>
                                          <option value="9">September</option>
                                          <option value="10">October</option>
                                          <option value="11">November</option>
                                          <option value="12">December</option>
                                       </select>
                                       <i className="validate " aria-hidden="true" style={{display:'none'}}></i>
                                       <span id="dobMonth_err" className="error_msg"></span>
                                    </div>
                                    <div className="form-group col-lg-4 col-md-4 col-sm-4 col-12 rowItem">
                                       <select onChange={handleChange} name="dobYear" id="lstDobYear" className="form-control">
                                             <option value="">Year</option>
                                             <option value="2002">2002</option>
                                             <option value="2001">2001</option>
                                             <option value="2000">2000</option>
                                             <option value="1999">1999</option>
                                             <option value="1998">1998</option>
                                             <option value="1997">1997</option>
                                             <option value="1996">1996</option>
                                             <option value="1995">1995</option>
                                             <option value="1994">1994</option>
                                             <option value="1993">1993</option>
                                             <option value="1992">1992</option>
                                             <option value="1991">1991</option>
                                             <option value="1990">1990</option>
                                             <option value="1989">1989</option>
                                             <option value="1988">1988</option>
                                             <option value="1987">1987</option>
                                             <option value="1986">1986</option>
                                             <option value="1985">1985</option>
                                             <option value="1984">1984</option>
                                             <option value="1983">1983</option>
                                             <option value="1982">1982</option>
                                             <option value="1981">1981</option>
                                             <option value="1980">1980</option>
                                             <option value="1979">1979</option>
                                             <option value="1978">1978</option>
                                             <option value="1977">1977</option>
                                             <option value="1976">1976</option>
                                             <option value="1975">1975</option>
                                             <option value="1974">1974</option>
                                             <option value="1973">1973</option>
                                             <option value="1972">1972</option>
                                             <option value="1971">1971</option>
                                             <option value="1970">1970</option>
                                             <option value="1969">1969</option>
                                             <option value="1968">1968</option>
                                             <option value="1967">1967</option>
                                             <option value="1966">1966</option>
                                             <option value="1965">1965</option>
                                             <option value="1964">1964</option>
                                             <option value="1963">1963</option>
                                             <option value="1962">1962</option>
                                             <option value="1961">1961</option>
                                             <option value="1960">1960</option>
                                             <option value="1959">1959</option>
                                             <option value="1958">1958</option>
                                             <option value="1957">1957</option>
                                             <option value="1956">1956</option>
                                             <option value="1955">1955</option>
                                             <option value="1954">1954</option>
                                             <option value="1953">1953</option>
                                             <option value="1952">1952</option>
                                             <option value="1951">1951</option>
                                             <option value="1950">1950</option>
                                             <option value="1949">1949</option>
                                             <option value="1948">1948</option>
                                             <option value="1947">1947</option>
                                             <option value="1946">1946</option>
                                             <option value="1945">1945</option>
                                             <option value="1944">1944</option>
                                             <option value="1943">1943</option>
                                             <option value="1942">1942</option>
                                             <option value="1941">1941</option>
                                             <option value="1940">1940</option>
                                             <option value="1939">1939</option>
                                             <option value="1938">1938</option>
                                             <option value="1937">1937</option>
                                             <option value="1936">1936</option>
                                             <option value="1935">1935</option>
                                             <option value="1934">1934</option>
                                             <option value="1933">1933</option>
                                             <option value="1932">1932</option>
                                             <option value="1931">1931</option>
                                             <option value="1930">1930</option>
                                             <option value="1929">1929</option>
                                             <option value="1928">1928</option>
                                             <option value="1927">1927</option>
                                             <option value="1926">1926</option>
                                             <option value="1925">1925</option>
                                             <option value="1924">1924</option>
                                             <option value="1923">1923</option>
                                             <option value="1922">1922</option>
                                             <option value="1921">1921</option>
                                             <option value="1920">1920</option>
                                             <option value="1919">1919</option>
                                             <option value="1918">1918</option>
                                             <option value="1917">1917</option>
                                             <option value="1916">1916</option>
                                             <option value="1915">1915</option>
                                             <option value="1914">1914</option>
                                             <option value="1913">1913</option>
                                             <option value="1912">1912</option>
                                             <option value="1911">1911</option>
                                             <option value="1910">1910</option>
                                       </select>
                                       <i className="validate " aria-hidden="true" style={{display:'none'}}></i>
                                       <span id="dobYear_err" className="error_msg"></span>
                                    </div>
                                    <span id="dob_final_err" className="error_msg"></span>
                                 </div>
                              </fieldset>
                           </div>
                           <div className="mb-3 text-center">{formStep==1 && 
                              <button onClick={validateStep} className="btn btn-warning next01">Next</button>
                           }
                           </div>
                        </div>
                        <div id="slide02" style={{display:formStep==1?'none':'block'}}>
                           <h3>Enter Your Contact Details</h3>
                           <div className="mb-3 text-start">
                              <label for="FormControlInput4" className="form-label">Email Address</label>
                              <input onChange={handleChange} name="email" type="email" className="form-control" id="FormControlInput4" placeholder="Email Address" />
                           </div>
                           <div className="mb-3 text-start">
                              <label for="FormControlInput5" className="form-label">Phone Number</label>
                              <input onKeyPress={(e)=>restrictLetter(e)} onChange={handleChange} name="phoneNumber" type="tel" className="form-control" maxLength={10}  id="FormControlInput5" placeholder="Phone Number" />
                           </div>
                           <div className="mb-3 text-center">
                              <button onClick={validateStep} type="submit" className="btn btn-success" id="submit_claim">Submit</button>
                           </div>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
        </>
    )
}