import { useState, useEffect } from 'react';
import { Card, Button, FormControl, Modal, CloseButton } from 'react-bootstrap';
import { collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { BsXCircle, BsCheckLg, BsXLg } from "react-icons/bs";
import { db, auth } from './firebase';

function Habits() {
    const [habits, setHabits] = useState([])
    const [show, setShow] = useState(false)
    const [currentId, setCurrentId] = useState()

    const [user] = useAuthState(auth)
    const [querySnapshot] = useCollection(collection(db, 'habits'))

    useEffect(() => {
        (async () => {
            setHabits([])

            querySnapshot && querySnapshot.forEach((doc) => {
                if (doc.data()['uid'] === auth.currentUser.uid) {
                    setHabits((habits) => {
                        return [...habits, doc]
                    })
                }
            })
        })()
    }, [querySnapshot, user])

    const handleClose = (confirm) => {
        if (confirm) {
            const docRef = doc(db, 'habits', currentId)
            deleteDoc(docRef)
        }
        setCurrentId()
        setShow(false)
    }

    const handleChange = (docId, e) => {
        const docRef = doc(db, 'habits', docId)
        updateDoc(docRef, {
            text: e.target.value,
        })
    }

    const handleProgress = (docInput, color) => {
        const docRef = doc(db, 'habits', docInput.id)

        let tmp = docInput.data()['progress']
        let isFull = true

        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i] === null) {
                tmp[i] = color
                isFull = false
                break
            }
        }

        if (isFull) {
            tmp.shift()
            tmp.push(color)
        }

        updateDoc(docRef, {
            progress: tmp,
        })
    }

    return (
        <div style={{ maxWidth: '800px' }} className='w-100'>
            {habits.map((habit) =>
                <Card key={habit.id} className='rounded-pill overflow-hidden border-2 border-dark shadow my-3 flex-row'>
                    <div className='d-flex flex-column justify-content-center bg-secondary'>
                        <Button onClick={() => handleProgress(habit, 'var(--bs-success)')} style={{ minWidth: '100px' }} variant='success' size='lg' className='flex-grow-1'>
                            <BsCheckLg />
                        </Button>
                        <Button onClick={() => handleProgress(habit, 'var(--bs-danger)')} style={{ minWidth: '100px' }} variant='danger' size='lg' className='flex-grow-1'>
                            <BsXLg />
                        </Button>
                    </div>
                    <div className='flex-grow-1 d-flex flex-column'>
                        <div className='d-flex flex-row'>
                            {habit.data()['progress'].map((color) =>
                                <div style={{ backgroundColor: color, minHeight: '20px' }} className='flex-grow-1' />
                            )}
                        </div>
                        <div className='flex-grow-1 d-flex p-3 m-2 gap-3'>
                            <FormControl onChange={(e) => handleChange(habit.id, e)} value={habit.data()['text']} type='text' className='form-control-lg rounded-pill flex-grow-1' />
                            <button onClick={() => { setShow(true); setCurrentId(habit.id) }}><BsXCircle size={40} /></button>
                        </div>
                    </div>
                </Card>
            )}

            <Modal show={show} onHide={() => handleClose(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button onClick={() => handleClose(false)} variant='secondary' size='lg'>
                        No
                    </Button>
                    <Button onClick={() => handleClose(true)} variant='danger' size='lg'>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Habits;
