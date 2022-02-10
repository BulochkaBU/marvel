import { useState } from "react";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import ComicsList from '../comicsList/ComicsList'

import decoration from '../../resources/img/vision.png';

const App = () => {

    const [selectedChar, setChar] = useState(null)

    const onSelectedChar = (id) => {
        setChar(id)
    }
    
    const [selectedComics, setComics] = useState(null)

    const onSelectedComics = (id) => {
        setComics(id)
    }  

    return (
        <div className="app">
            <AppHeader/>
            <main>
            <ComicsList onSelectedComics={onSelectedComics} selectedComics={selectedComics}/>   
            {/* <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
                <div className="char__content">
                    <ErrorBoundary>
                        <CharList onSelectChar={onSelectedChar} charId={selectedChar} />
                    </ErrorBoundary>
                        
                    <ErrorBoundary>
                        <CharInfo charId={selectedChar} />
                    </ErrorBoundary>
                    <ComicsList />                        
                </div> */}
                <img className="bg-decoration" src={decoration} alt="vision"/>
            </main>
        </div>
    )

}

export default App;