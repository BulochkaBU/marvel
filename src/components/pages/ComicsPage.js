import { useState } from "react";

import ComicsList from '../comicsList/ComicsList'
import AppBanner from '../appBanner/AppBanner'

const ComicsPage = () => {
    const [selectedComics, setComics] = useState(null)

    const onSelectedComics = (id) => {
        setComics(id)
    }  

    return (
        <>
            <AppBanner />
            <ComicsList onSelectedComics={onSelectedComics} selectedComics={selectedComics}/>
        </>
    )
}

export default ComicsPage;