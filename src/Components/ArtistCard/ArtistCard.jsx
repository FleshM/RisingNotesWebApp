import { useNavigate, useParams } from "react-router-dom"
import backIcon from '../../Images/artist-card/Chevron_Left.svg'
import ArtistImage from '../../Images/artist-card/artist-template.png'
import TrackTemplate from '../../Images/artist-card/Rectangle 161.png'

import ArtistInfo from "./ArtistCardComponents/ArtistInfo/ArtistInfo.jsx"
import TopTracks from "./ArtistCardComponents/TopTracks/TopTracks.jsx"
import { useContext, useEffect, useState } from "react"
import { SubscriptionsContext, api, axiosAuthorized, axiosUnauthorized } from "../App/App.jsx"
import Song from "../Song/Song"
import BackButton from "../BackButton.js"
import Songs from "./ArtistCardComponents/Songs/Songs.jsx"
import Blog from "./ArtistCardComponents/Blog/Blog.jsx"

function ArtistCard(props){
    const navigate = useNavigate();
    const params = useParams();
    const [artist, setArtist] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [songs, setSongs] = useState([]);
    const {subscriptions, setSubscriptions} = useContext(SubscriptionsContext);
    const [isSubscribed, setIsSubscribed] = useState(subscriptions.includes(params.id));

    const [currPage, setCurrPage] = useState(0);

    const handleSubscribe = () => {
        axiosAuthorized.post(api + `api/subscription/${params.id}`)
        .then( r => {
            setSubscriptions(e => e = [...e, params.id])
            setIsSubscribed(subscriptions.includes(params.id));
            setIsLoaded(false);
        });
    }

    const handleUnsubscribe = () => {
        axiosAuthorized.delete(api + `api/subscription/${params.id}`)
        .then( r => {
            setSubscriptions(e => e = e.filter(el => el != params.id))
            setIsSubscribed(subscriptions.includes(params.id));
            setIsLoaded(false);
        });
    }

    useEffect(() => {
        // axiosUnauthorized.get(api + `api/user/${params.id}/logo`)
        axiosUnauthorized.get(api + `api/subscription/${params.id}/count`)
        .then(resp => {
            axiosUnauthorized.get(api + `api/author/${params.id}`)
            .then(response => {
                setArtist({
                    userId: response.data.userId,
                    artistName: response.data.name,
                    artistImage: ArtistImage,
                    artistInfoText: response.data.about,
                    subscribersCount: resp.data.count,
                    socialLinks:{
                        site: response.data.webSiteLink,
                        vk: response.data.vkLink,
                        yandex:response.data.yaMusicLink
                    },
                    topTracks:[{
                        trackName:'Deconstructive Achievements',
                        trackCover: TrackTemplate
                    },{
                        trackName:'Infinite Rove',
                        trackCover: TrackTemplate
                    },{
                        trackName:'Noir Clouds',
                        trackCover: TrackTemplate
                    },{
                        trackName:'Meanwhile',
                        trackCover: TrackTemplate
                    }]
                });

                setIsLoaded(true);
            })
            .catch(err => {
                throw err;
            })
        })
        .catch(err => {
            throw err;
        })

    }, [isLoaded])   

    const handleChangePage = (id) => {
        // смена страницы в лк
        setCurrPage(id);
    };

    if (isLoaded)
        return(
            <section className="artist-card-container">
                <div className="content-container">
                    <BackButton/>
                    <ArtistInfo artist={artist} 
                        handleSubscribe={handleSubscribe} 
                        handleUnsubscribe={handleUnsubscribe}/>

                    <div className="artist-card-menu">
                        <a onClick={() => handleChangePage(0)} 
                            className={currPage === 0 ? 'artist-card-menu-item account-page-active' : 'artist-card-menu-item'}>
                            Главная
                        </a>
                        <a onClick={() => handleChangePage(1)} 
                            className={currPage === 1 ? 'artist-card-menu-item account-page-active' : 'artist-card-menu-item'}>
                            Треки
                        </a>
                        <a onClick={() => handleChangePage(2)} 
                            className={currPage === 2 ? 'artist-card-menu-item account-page-active' : 'artist-card-menu-item'}>
                            Клипы
                        </a>
                        <a onClick={() => handleChangePage(3)} 
                            className={currPage === 3 ? 'artist-card-menu-item account-page-active' : 'artist-card-menu-item'}>
                            Блог
                        </a>
                    </div>

                    {currPage === 0 ? <Songs artist={artist}/> : <></>}
                    {currPage === 1 ? <Songs artist={artist}/> : <></>}
                    {currPage === 3 ? <Blog/> : <></>}
                    
                </div>
                <img className="artist-bg-image" src={api + `api/user/${artist.userId}/logo?width=400&height=400`}/>
            </section>
        )
}

export default ArtistCard