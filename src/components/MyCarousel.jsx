import Carousel from 'react-material-ui-carousel';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseball } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';


function MyCarousel() {
    const items = [
        { imgSrc: '/banner1.jpg', alt: '배너1', link: '/prediction' },
        { imgSrc: '/banner2.jpg', alt: '배너2', link: '/quiz' },
        { imgSrc: '/banner3.jpg', alt: '배너3', link: '/event' },
    ];

    return (
        <div >
            <Carousel
                autoPlay={true}
                swipe={true}
                cycleNavigation={true}
                fullHeightHover={false}
                animation='slide'
                IndicatorIcon={
                    <FontAwesomeIcon icon={faBaseball} shake size='sm' />
                }
                indicatorIconButtonProps={{
                    style: {
                        color: '#ccc',
                        margin: '0 10px',
                    }
                }}
                activeIndicatorIconButtonProps={{
                    style: {
                        color: "#1f1f1f",
                        margin: '0 10px',
                    }
                }}
                indicatorContainerProps={{
                    style: {
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '7px 0',
                        textAlign: 'center',
                    }

                }}
            >
                {items.map((item, index) => (
                    <Link to={item.link} key={index}>
                        <div>
                            <img src={process.env.PUBLIC_URL + item.imgSrc} alt={item.alt} />
                        </div>
                    </Link>
                ))}
            </Carousel >
        </div>
    );
}

export default MyCarousel;