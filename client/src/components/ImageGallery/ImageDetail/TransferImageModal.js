import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import { useHistory } from 'react-router';
import { getUsersGalleries, movePhotoToAnotherGallery } from '../../../helpers/request';
import './transferImageModal.css'
Modal.defaultStyles.overlay.backgroundColor = '#f5f5f5e6';

const TransferImageModal = ({modalState,setModalState,userId,imageId}) => {
    const [userGalleries,setUserGalleries] = useState(null)
    const [selectedGalaryName,setSelectedGalaryName] = useState('select a gallery')
    const [selectedGalaryId,setSelectedGalaryId] = useState(null)
    const [msg,setMsg] = useState(null)
    const history=useHistory()
    useEffect(() => {
        getUsersGalleries(userId)
        .then(res=>setUserGalleries(res))
    }, [])
    const handleClose=()=>{
        setModalState(false)
    }
    const handleMove = ()=>{
        if(!selectedGalaryId)
        {
            setMsg("select a gallery to begin");
            return;
        }
        setMsg("moving...")
        movePhotoToAnotherGallery(imageId,selectedGalaryId)
        .then(res=>{
            if(res.status===200)
            {
                setMsg("Transferred successfully")
                setTimeout(()=>{
                    handleClose();
                    history.push(`/gallery/${selectedGalaryId}`)
                },200)
            }
            else
            {
                console.log("failed",res)
                setMsg(res.error)
            }
        })
        .catch((error)=>{
            console.log(error)
          });

    }
    
    return (
        <Modal
        isOpen={modalState}
        onRequestClose={handleClose}
        className="Modal"
        >
        <div class="popup" id="cookiesPopup">
                <h1 className="popup--title">choose gallery to transfer</h1>
                <button class="close--btn" onClick={handleClose}>✖</button>
            {msg && <p>{msg}</p>}
            {userGalleries?
                (<div class="select-box">
                <div class="select-box__current" tabindex="1">
                    <div class="select-box__value"><input class="select-box__input" type="radio" id="0" value="" name="" checked="checked" />
                        <p class="select-box__input-text">{selectedGalaryName}</p>
                    </div>
                    
                    <img class="select-box__icon" src="http://cdn.onlinewebfonts.com/svg/img_295694.svg" alt="Arrow Icon" aria-hidden="true" />
                </div>
                <ul class="select-box__list">
                    {
                    userGalleries.map(gallery=>{
                    return <li><label class="select-box__option" ariaHidden="aria-hidden" onClick={()=>{setSelectedGalaryId(gallery.id);setSelectedGalaryName(gallery.name)}}>{gallery.name}</label></li>
                    
                        })
                    }
                </ul>
            </div>)
            :
            <p>you do not have any gallery</p>
            }
            <button class="btn" onClick={()=>handleMove()}>MOVE</button>
        </div>
        </Modal>
    )
}

export default TransferImageModal
