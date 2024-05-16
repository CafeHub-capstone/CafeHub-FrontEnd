import styled from "../../styles/GlobalStyle.module.css";
import style from "../../styles/CafeListStyle.module.css";
import styles from "./bookmark.module.css"
import img_bookmark_bg from "../../asset/img/img_bookmark_bg.png";
import img_deerSweetLab from "../../asset/img/img_deerSweetLab.png";
import img_star from "../../asset/img/img_star.png"
import { ReactComponent as Icon_bookmark } from "../../asset/icon/icon_bookmark.svg"
import { ReactComponent as Icon_like } from "../../asset/icon/icon_like.svg"
import { ReactComponent as Icon_notLike } from "../../asset/icon/icon_notLike.svg"
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import axios from "axios";

function Bookmark(){
    
    const [dataList, setDataList] = useState([]);


    const pageLoad = () => {        
        axios.get(`http://localhost:8080/bookmark`)
        .then(response => {
            setDataList(response.data.cafeList);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
    }

    useEffect(()=>{
        pageLoad();
    }, [])

    return (
        <>
            <div className={styled.page_wrapper}>
                <main className={styled.main_container}>
                    <article className={style.containerWrapper}>
                        <img src={img_bookmark_bg} className={style.imgBg}/>
                        <article className={style.textContainer}>
                            <Icon_bookmark fill="white" className={style.icon}/>
                            <span className={style.textOnBg}>북마크 카페 리스트</span>
                        </article>
                    </article>

                    {dataList?.length !== 0 ?
                    <>
                        <ul>
                            {dataList?.map((data, index) => (<BookmarkList key={index} props={data}/>))}
                        </ul>
                     </> : <Loading />}

                </main>
            </div>
        </>
    )
}
export default Bookmark;



function BookmarkList({props}){
    const [like, setLike] = useState(true);
    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        if (initialized) {
        const data = {
            cafeId: props.cafeId,
            bookmarkChecked: like
        };

        console.log("Sending data to server:", data); // 콘솔에 데이터를 출력하여 확인
        axios.post(`http://localhost:8080/bookmark`, data)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.error('Error updating data: ', error);
            });
        } else {
            setInitialized(true);
        }
    }, [like]);
        

    const changeColor = () => {
        setLike(!like);
    }

    const LikeIcon = () => {
        return like ? <Icon_like fill="#FF4F4F" /> : <Icon_notLike fill="#FFF" />;
    };

    const navigate = useNavigate();
    const handleNavigation = () => {
        navigate('/CafeDetail');
    };

    return (  
        <div className={style.flexLine}>
            <img className={style.cafeImg} src={props.cafePhotoUrl} style={{cursor:'pointer'}} onClick={handleNavigation}/>
            <div className={style.CafeTextContainer}>
                <div  onClick={handleNavigation} style={{cursor:'pointer'}}>
                    <span className={style.cafeTitle}>{props.cafeName}</span>
                    <span className={style.cafeTheme}>{props.cafeTheme}</span>
                    <div className={style.starRatingReview}>
                        <img className={style.img_star} src={img_star}></img>
                        <span className={style.cafeRating}>{props.cafeRating} ({props.cafeReviewNum})</span>
                    </div>
                </div>
                <div className={styles.likeContainer} style={{ cursor: 'pointer' }} onClick={changeColor}>
                    <LikeIcon />
                </div>
            </div>
        </div>
    )
}