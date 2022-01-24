import { Component } from 'react';
import './charInfo.scss';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount = () => {
        this.updateChar();

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.charId !== prevProps.charId){
            this.updateChar();
        }
    }


    onCharLoaded = (char) => {
        this.setState({char, loading: false})
    }

    onCharLoading= () => {
        this.setState({loading: true})
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId){
            return;
        }
        this.onCharLoading();
        this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError);
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }




    render(){
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner/>  : null;
        const content = !(loading || error || !char) ? <View character={char} /> : null;

        return (
            <div className="char__info">
                {errorMessage}
                {spinner}
                {content}
                {skeleton}
            </div>
        )
    }
}

const View = ({character}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = character;

    let styleImg = {'objectFit': 'cover'};

    if (thumbnail.includes('image_not_available')){
        styleImg = {'objectFit': 'contain'};
    }


    return(
        <>
        <div className="char__basics">
            <img src={thumbnail} alt={name} style={styleImg}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">Homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
                </div>
        </div>
        <div className="char__descr">
            {description}
        </div>
        <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? "Comics not found with this character" : null}

                {comics.slice(0, 10).map((item, i) => {
                    return (
                        <li className="char__comics-item" key={i}>
                            {item.name}
                        </li>
                    )
                })}


            </ul>
        </>
    )
}

export default CharInfo;