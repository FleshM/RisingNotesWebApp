import saveIcon from '../../../Images/account-page/save-icon.svg';
import linkIcon from '../../../Images/account-page/link-icon.svg';
import vkIcon from '../../../Images/account-page/vk-icon.svg';
import yandexIcon from '../../../Images/account-page/yandex-icon.svg';
import plus from '../../../Images/account-page/plus-icon.svg';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Song from './Song';
import { api, axiosAuthorized, axiosUnauthorized } from '../../../Components/App/App';
import { Link } from 'react-router-dom';
import CustomButton from '../../../Components/CustomButton/CustomButton';

export default function AccountMusician (props) {
    const [uploads, setUploads] = useState([]);
    const [about, setAbout] = useState(props.about);
    const [vkLink, setVkLink] = useState(props.vkLink);
    const [yaMusicLink, setYaMusicLink] = useState(props.yaMusicLink);
    const [webSiteLink, setWebSiteLink] = useState(props.webSiteLink);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // получение списка заявок
        axiosAuthorized.get(`api/song/upload-request/list`)
        .then(response => {
            setUploads(response.data.publishRequestShortInfoList);
        })
    }, []);

    const handleSave = async (event) => {
        // вызов обновления информации о музыканте
        try {
            let newInfo = {
                about: about,
                vkLink: vkLink,
                yaMusicLink: yaMusicLink,
                webSiteLink: webSiteLink,
            }
            await props.handleRefreshMusicianInfo(newInfo);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }

    return (
        <div className="account-page-user">
            <h2>Информация о музыканте</h2>
            <p>Описание</p>
            <textarea placeholder='Введите информацию о вас или вашей группе... ' 
                className='account-page-textarea' onChange={e => setAbout(e.target.value)}>
                {about}
            </textarea>
            <p>Ссылки</p>
            <div className='account-page-link-wrapper'>
                <span><img alt='icon' src={linkIcon}/>Сайт</span>
                <input className='account-page-link' placeholder='Введите ссылку... ' 
                    value={webSiteLink} onChange={e => setWebSiteLink(e.target.value)}></input>
            </div>

            <div className='account-page-link-wrapper'>
                <span><img alt='icon' src={vkIcon}/>Вконтакте</span>
                <input className='account-page-link' placeholder='Введите ссылку... ' 
                    value={vkLink} onChange={e => setVkLink(e.target.value)}></input>
            </div>

            <div className='account-page-link-wrapper'>
                <span><img alt='icon' src={yandexIcon}/>Я.Музыка</span>
                <input className='account-page-link' placeholder='Введите ссылку... ' 
                    value={yaMusicLink} onChange={e => setYaMusicLink(e.target.value)}></input>
            </div>

            <CustomButton func={handleSave} icon={saveIcon} text={'Сохранить'} success={'Сохранено'}/>

            {/* <button className='account-page-filled-button' onClick={handleSave}>
                <img alt='icon' src={saveIcon}/>
                Сохранить
            </button> */}

            <h2>Все треки</h2>
            <audio ref={audioRef} type="audio/mpeg" autoPlay={true} style={{ display: 'none' }}/>
            <Link to={'/uploadmusic'} className='account-page-add-song'><img alt='icon' src={plus}/>Добавить трек</Link>

            <div className="tracks">
                {uploads.map(el => 
                    <Song 
                        key={el.id} 
                        id={el.id} 
                        artist={props.artist} 
                        status={el.status} 
                        audioRef={audioRef} 
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}/>
                )}
            </div>
            {uploads.length == 0 ? <p>Вы еще не загрузили ни одного трека</p> : <></>}
            
        </div>
    )
}