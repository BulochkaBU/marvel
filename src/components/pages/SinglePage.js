import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import AppBanner from '../appBanner/AppBanner'
import setContent from '../../utils/setContent';

const SinglePage = ({Component, dataType}) => {
    const {id} = useParams();
    const [data, setData] = useState(null)

    const {process, setprocess, getComic, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateData();
    }, [id])


    const onDataLoaded = (data) => {
        setData(data);
    }


    const updateData = () => {
        clearError();
        switch (dataType){
            case 'comic':
                getComic(id).then(onDataLoaded).then(() => setprocess('confirmed'));
                break;
            case 'character':
                getCharacter(id).then(onDataLoaded).then(() => setprocess('confirmed'));
                break;
            default: 
                throw new Error('Unexpected dataType')
        }
        
        
    }


    return (
        
        <>
            <AppBanner />
            {setContent(process, Component, data)}
        </>
    )
}

export default SinglePage;
