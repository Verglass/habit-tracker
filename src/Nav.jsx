import { useState, useEffect, useRef } from 'react';
import { Navbar, Form, Button } from 'react-bootstrap'
import { signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase'

function Nav() {
    const [user] = useAuthState(auth)
    const [inputValue, setInputValue] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        inputValue && await addDoc(collection(db, 'habits'), {
            text: inputValue,
            uid: auth.currentUser.uid,
            progress: Array(7).fill(null)
        })

        setInputValue('')
    }

    const logIn = () => {
        signInWithPopup(auth, new GoogleAuthProvider())
            .then((result) => {
                // console.log(result)
            }).catch((error) => {
                // console.log(error)
            });
    }

    const logOut = () => {
        signOut(auth)
    }

    return (
        <Navbar variant='dark' bg='dark' className='px-5'>
            {user && <Form className='d-flex w-50 gap-3'>
                <Button onClick={handleSubmit} type='submit' variant='outline-primary'>Submit</Button>
                <Form.Control onChange={(e) => setInputValue(e.target.value)} value={inputValue} type='text' placeholder='Enter a new habit' className='flex-grow-1' />
            </Form>}
            {user ?
                <Button onClick={logOut} variant='outline-primary' className='ms-auto'>Log out</Button>
                :
                <Button onClick={logIn} variant='outline-primary' className='ms-auto'>Log in</Button>
            }
        </Navbar>
    )
}

export default Nav;
