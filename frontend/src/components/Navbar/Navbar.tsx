import { Button } from 'antd'


const Navbar = () => {
  return (
    <div className='max-w-full flex items-center justify-between 2xl:w-[1200px] mx-auto px-6 border-b-2 border-gray-200 bg-white py-4'>
        {/* <div className='gap-6 flex items-center'> */}
            <h3 className='text-purple-600 font-bold text-2xl'>TechSphere</h3>

        {/* </div> */}

        <div className='flex items-center gap-2'>
            <Button  type='default'  className='' >Login</Button>
            <Button  type='primary' >Sign Up</Button>
        </div>
    </div>
  )
}

export default Navbar