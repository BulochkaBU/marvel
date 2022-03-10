import { useState } from "react";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import CharSearchForm from '../charSearchForm/CharSearchForm'

import decoration from '../../resources/img/vision.png';


const MainPage = () => {

    const [selectedChar, setChar] = useState(null)

    const onSelectedChar = (id) => {
        setChar(id)
    }

    return (
        <>
            <HelmetProvider>
                <Helmet>
                        <meta
                            name="description"
                            content="Marvel information portal"
                            />
                        <title>Marvel portal</title>
                    </Helmet>
            </HelmetProvider>

            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>

            <CharSearchForm/>

            <div className="char__content">
                <ErrorBoundary>
                    <CharList onSelectChar={onSelectedChar} charId={selectedChar} />
                </ErrorBoundary>
                        
                <ErrorBoundary>
                    <CharInfo charId={selectedChar} />
                </ErrorBoundary>                    
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;