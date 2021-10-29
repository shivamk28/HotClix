import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import ImageGallery from '../ImageGallery/Gallery'
import { UserAvatarSmall } from '../UserProfile/Profile'
import {
    getGalleryDetails, getImages,
    isUserOwner, deleteGallery, requestGalleryDownload, renameGallery
} from '../../helpers/request'
import { titleCase } from '../../helpers'
import './galleryHome.css'
import EdiText from 'react-editext'

function UserGallery() {

    const history = useHistory()
    const { galleryId } = useParams()

    // STATES
    const [galleryData, setGalleryData] = useState({ gallery: {}, loading: true })
    const [galleryImages, setGalleryImages] = useState({ images: [], loading: true })
    const [galleryName,setGalleryName] = useState();
    const [renameErrorMsg,setRenameErrorMsg] = useState('')

    useEffect(() => {

        // GALLERY DATA 

        getGalleryDetails(galleryId)
            .then(gallery => {
                // console.log(gallery)
                setGalleryData({
                    gallery: gallery,
                    loading: false
                })
                setGalleryName(titleCase(gallery.name))
            })
            .catch(console.log)

        // GALLERY IMAGES 

        getImages(undefined, galleryId)
            .then(images => {
                // console.log(images)
                setGalleryImages({
                    images: images,
                    loading: false
                })
            })
            .catch(console.log)

    }, [galleryId])


    const handleDelete = (e) => {
        e.preventDefault()
        const conf = window.confirm(`Do you want to delete the gallery?\nAll the images of this gallery will be removed`)

        if (conf) {
            deleteGallery(galleryData.gallery.id)
                .then(res => {
                    if (res.data === "") {
                        const token = localStorage.getItem('auth-token')
                        const user = JSON.parse(atob(token.split('.')[1]))
                        history.push(`/profile/${user.id}`)
                    }
                })
                .catch(console.log)
        }
    }


    const handleRename = (newName)=>{
        if(newName.length>255)
        {
            setRenameErrorMsg("max 255 chars allowed");
            return false;
        }
        setRenameErrorMsg("updating...")
        return renameGallery(galleryData.gallery.id,newName)
        .then(res=>{
            if(res.status===200)
            {
                setRenameErrorMsg("updated successfully")
                setGalleryName(newName)
                return true;
            }
            setRenameErrorMsg(res.error)
            return false
            
        })
        .catch((error)=>{
            console.log(error)
            return false
          });
    }

    // TODO 
    // enable download 
        
    const handleGalleryDownload = (e) => {
          e.preventDefault()
         alert("Gallery is being downloaded in .zip format have patient!!")
          requestGalleryDownload(galleryId,galleryData.gallery.name);     
   }




    return (
        <div className="main-container">
            <div className="top-detail-container gallery-detail-container">
                <div className="gallery-details">
                    <div className="gallery-and-user">
                        <div className="gallery-title">
                            {
                                galleryData.loading
                                    ? 'loading...'
                                    :
                                    (
                                        // if user is owner show editable component
                                        isUserOwner(galleryData.gallery.created_by)
                                        ? 
                                        <EdiText 
                                        type="text" 
                                        value={galleryName} 
                                        onSave={setGalleryName} 
                                        hint="max 255 chars allowed" 
                                        showButtonsOnHover="true" 
                                        submitOnEnter="true" 
                                        cancelOnEscape="true" 
                                        cancelOnUnfocus="true" 
                                        canEdit={isUserOwner(galleryData.gallery.created_by)} 
                                        validation={handleRename} 
                                        validationMessage={renameErrorMsg}
                                        />
                                        :
                                        //else noraml name
                                        <p>{galleryName}</p>
                                    )

                            }
                        </div>
                        <div className="gallery-user">
                            <UserAvatarSmall
                                letter={
                                    galleryData.loading
                                        ? '.'
                                        : galleryData.gallery.created_by_username.charAt(0)
                                }
                            />
                            <p>
                                {
                                    galleryData.loading
                                        ? 'loading...'
                                        : galleryData.gallery.created_by_username
                                }
                            </p>
                        </div>
                    </div>
                    <div className="gallery-options">
                        <p>
                            {
                                galleryData.loading
                                    ? '... photos'
                                    : `${galleryData.gallery.total_photos} 
                                        photo${galleryData.gallery.total_photos > 1 ? 's' : ''}`
                            }
                        </p>
                        <button onClick={handleGalleryDownload}>Download</button>
                        {
                            galleryData.loading
                                ? <>
                                </>
                                : isUserOwner(galleryData.gallery.created_by)
                                    ? <button onClick={handleDelete}>Delete</button>
                                    : <></>
                        }
                    </div>
                </div>
            </div>
            {
                galleryImages.loading
                    ? <></>
                    : <ImageGallery images={galleryImages.images} />
            }
        </div>
    )
}


export default UserGallery
