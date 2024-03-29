import Reac, {useState} from "react";
import {Button} from "../../components";
import { useParams } from "react-router-dom";
import { apiResetPassword } from "../../apis";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const {token} = useParams();
   
    const handleResetPassword = async() => {
        const response = await apiResetPassword({password, token});
        if(response?.success){
            toast.success(response?.message, {theme: 'colored'});
          } else {
            toast.warning(response?.message, {theme: 'colored'});
          }
    };
    
  return (
    <div className="animate-slide-right absolute top-0 bottom-0 left-0 right-0 bg-white flex flex-col items-center py-8 z-50">
      <div className="flex flex-col gap-4">
        <label htmlFor="password">Enter your password</label>
        <input
          type="text"
          id="password"
          className="w-[800px] border-b pb-2 outline-none placeholder:text-sm"
          placeholder="Type here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-end w-full gap-4">
          <Button
            name="Submit"
            handleOnClick={handleResetPassword}
            style="my-2 px-4 py-2 rounded-md text-white bg-blue-500 text-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
