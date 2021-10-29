import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getImageDetails, getImages, isUserOwner } from '../../../helpers/request'
import { UserAvatarSmall } from '../../UserProfile/Profile'
import { requestDownload } from '../../../helpers/request'
import './imageDetail.css'
import Modal from 'react-modal';
import TransferImageModal from './TransferImageModal'
Modal.setAppElement('#root');


function ImageDetail() {

    const { imageId } = useParams()
    const initState = {
        image: {},
        moreImages: [],
        loading: true
    }

    // STATES
    const [state, setState] = useState(initState)
    const [isTransferImageModalOpen,setIsTransferImageModalOpen] = useState(false)
    useEffect(() => {

        setState(pr => ({
            ...pr,
            loading: true
        }))

        const getImageAndMore = async () => {
            const image = await getImageDetails(imageId)
            const moreImages = await getImages(image.uploaded_by)
            setState({
                image,
                moreImages,
                loading: false
            })
        }
        getImageAndMore()

    }, [imageId])


    return (
        <div className="image-container">
            <div className="image-info">
                <div className="image-user">
                    {
                        state.loading
                            ? ('Loading...')
                            : (
                                <>
                                    <UserAvatarSmall letter={state.image.username.charAt(0)} />
                                    {state.image.username}
                                </>
                            )
                    }
                </div>
                {
                state.image && 
                (isUserOwner(state.image.uploaded_by) &&
                <div onClick={()=>setIsTransferImageModalOpen(true)} title="move image to another gallery"  className="image-download">
                    <img src="https://cdn-icons-png.flaticon.com/512/72/72204.png" alt="image transfer icon" width="20px" height="20px"/>
                    transfer image
                </div>)
                }
                <div 
                    className="image-download"
                    onClick={
                        () => {
                            requestDownload(state.image.file_url, 
                            state.image.name, 
                            'jpg')
                        }
                    }
                    >
                    <i className="fa fa-download"></i>
                    Download
                </div>
            </div>
            <div className="image-wrapper">
                {
                    state.loading
                        ? 'Loading...'
                        : <img src={state.image.file_url} className="img-detail-view" />
                }
                <div className="more-user-images">
                    <h2>
                        More from
                        {state.loading ? ' ...' : ` ${state.image.username}`}
                    </h2>
                    <div className="gallery-container more-image-gallery">
                        {
                            state.moreImages.map(image => (
                                <Link
                                    to={`../image/${image.id}`}
                                    key={image.id}
                                >
                                    <div className="preview-img" >
                                        <img src={image.thumbnail_url} className="img-detail-view" />
                                    </div>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
            {Object.keys(state.image).length &&<TransferImageModal modalState={isTransferImageModalOpen} setModalState={setIsTransferImageModalOpen} userId={state.image.uploaded_by} imageId={imageId}/>}
        </div>
    )
}

export default ImageDetail
