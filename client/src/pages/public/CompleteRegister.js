import React, {useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import path from '../../utils/path'
import Swal from 'sweetalert2'

const CompleteRegister = () => {
    const {status} = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        if(status === 'failed'){
            Swal.fire('Oop!', 'Register failed', 'error').then(() =>{
                navigate(`/${path.LOGIN}`)
            })
        }
        if(status === 'succeed'){
            Swal.fire('Congratulaton', 'Register succeed. Please go to login!', 'success').then(() =>{
                navigate(`/${path.LOGIN}`)
            })
        }
    }, [])
  return (
   <div className='h-screen w-screen bg-gray-100'>
     
   </div>
  )
}

export default CompleteRegister