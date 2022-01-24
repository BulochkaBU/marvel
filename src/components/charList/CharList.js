import { Component } from 'react';
import './charList.scss';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component{
    state = {
        chars: [],
        loading: true,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidMount = () => {
        this.marvelService.getAllCharacters().then(this.onCharsLoaded).catch(this.onError);
    }

    componentWillUnmount = () => {
        console.log('unmount')
    }

    onCharsLoaded = (chars) => {
        this.setState({chars, loading: false})
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }

    renderListChar(arr) {
        const listChars = arr.map(item => {
            let styleImg = {'objectFit': 'cover'}

            if (item.thumbnail.includes('image_not_available')){
                styleImg = {'objectFit': 'unset'};
            }
            return (
                <li className="char__item" key={item.id} onClick={() => this.props.onSelectChar(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={styleImg}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        })
        return (
            <ul className="char__grid">
            {listChars}
            </ul>
        )
    }

    render() {

        const {chars, loading, error} = this.state;

        const allChars = this.renderListChar(chars)
        
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner/>  : null;
        const content = !(loading || error) ? allChars : null;


        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;