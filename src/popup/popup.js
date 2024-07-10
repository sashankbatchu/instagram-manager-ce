import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AiFillEdit } from "react-icons/ai";
import './popup.css'

const Popup = () => {
    const [dailyLimit, setDailyLimit] = useState(0);
    const [currCount, setCurrCount] = useState(0);
    const [canSetLimit, setCanSetLimit] = useState(false);
    const [showCodeEntry, setShowCodeEntry] = useState(false)
    const [verifiedOrNot, setVerifiedOrNot] = useState(false)
    const [userEnteredCode, setUserEnteredCode] = useState('')
    const [actualCode, setActualCode] = useState('')
    const [contact, setContact] = useState('')

    useEffect(() => {
        chrome.storage.local.get(['dailyLimit', 'currCount', 'showCodeEntry', 'contact'], (result) => {
            setDailyLimit(result.dailyLimit || 0);
            setCurrCount(result.currCount || 0);
            setShowCodeEntry(result.showCodeEntry || false);
            setContact(result.contact || '')
        });
        setActualCode(Math.floor(100000 + Math.random() * 900000).toString());
    }, [])

    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value, 10);
        setDailyLimit(isNaN(newLimit) ? 0 : newLimit);
    }

    const saveLimit = () => {
        chrome.storage.local.set({'dailyLimit': dailyLimit || 0});
        setCanSetLimit(false);
    }

    const handleCodeChange = (e) => {
        setUserEnteredCode(e.target.value);
    }

    const handleCodeSubmit = () => {
        chrome.storage.local.set({ showCodeEntry: false });
        if (userEnteredCode === actualCode) {
            alert('Code is Correct')
            setCanSetLimit(true)
            setShowCodeEntry(false)        
            chrome.storage.local.set({ showCodeEntry: false });
        } else {
            alert('Code is incorrect')
            setShowCodeEntry(false)
            setCanSetLimit(false)
            chrome.storage.local.set({ showCodeEntry: false });
        }
    }

    const checkIfValidContact = () => {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(contact)) {
            alert('Please enter a valid email address');
            return
        }
    }

    const handleEditRequest = () => {
        checkIfValidContact();
        if (contact === '') {
            alert('Please enter a contact')
            return
        }

        fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                toSendEmail: contact,
                code: actualCode
            })
        }).then((res) => {
            alert('Request Successfully Sent')
            setShowCodeEntry(true);
            chrome.storage.local.set({ showCodeEntry: true });
        }).catch((err) => {
            alert('Error sending email:', err)
        })
    }

    const handleContact = (e) => {
        setContact(e.target.value)
        chrome.storage.local.set({'contact': e.target.value || ''});
    }

    return (
        <div className='popup'>
            <h1 id='title'>Instagram Limiter</h1>
            <div>
                <div>
                    <label htmlFor='contact' >Set Email Contact: </label>
                    <input type='email' id='contact' value={contact} onChange={handleContact}/>
                </div>
                <div>
                    <label htmlFor='limit' >Set Limit: </label>
                    <input type='number' id='limit' value={dailyLimit} onChange={handleLimitChange} min='0' readOnly={!canSetLimit}/>
                </div>
                {canSetLimit ? (
                    <button id='button' onClick={saveLimit}><i className="fas fa-save"></i> Save</button>
                ) : (
                    <button id='button' onClick={handleEditRequest}><AiFillEdit /> Request Edit</button>
                )}  
                {showCodeEntry && (
                    <div>
                        <label htmlFor='code'>Enter Code: </label>
                        <input type='text' id='code' placeholder='Enter Code' onChange={handleCodeChange} />
                        <button id='button' onClick={handleCodeSubmit}>Submit</button>
                    </div>
                )}            
            </div>
            <p>Visits Today: {currCount}</p>
        </div>
    )
}

ReactDOM.render(<Popup />, document.getElementById('root'));
