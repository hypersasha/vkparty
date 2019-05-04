import React, {Component} from 'react';
import {Button, Checkbox, Div, FormLayout, Input, Select, Slider, Textarea} from "@vkontakte/vkui/src";
import {declOfNum, getTextDate} from "../../../lib/Utils";
import PropTypes from 'prop-types';

class CreatePartyForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title || '',
            titleStatus: 'default',
            date: this.props.date || null,
            dateStatus: 'default',
            private: this.props.private || false,
            maxMovies: this.props.maxMovies || 3
        };

        this.onChange = this.onChange.bind(this);
        this.onChangeMaxMovies = this.onChangeMaxMovies.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.InitPrivate = this.InitPrivate.bind(this);
    }

    /**
     * Triggers on user input in title and date.
     * @param e
     */
    onChange(e) {
        const {name, value} = e.currentTarget;
        this.setState({
            [name]: value
        });
    }

    onChangeMaxMovies(value) {
        this.setState({
            maxMovies: value
        });
    }

    /**
     * Returns date betwen today and 30 days forward.
     * @param startDate today date
     * @param endDate 30 days forward
     * @returns {Array} array of dates
     */
    getDatesBetween(startDate, endDate) {
        let dates = [],
            currentDate = startDate,
            addDays = function (days) {
                let date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            };
        while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
        }
        return dates;
    }

    /**
     * Returns dates object for creating options list.
     * @constructor
     */
    GetDates() {
        let today = new Date();
        let nextDate = today.setDate(today.getDate() + 30);
        let dates = this.getDatesBetween(new Date(), nextDate);
        let datesOptions = {};
        dates.forEach((date) => {
            datesOptions[date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()] = getTextDate(date);
        });
        return datesOptions;
    }

    /**
     * Checks party title for valid.
     * @returns {boolean} is title valid?
     * @constructor
     */
    CheckTitle() {
        let trimTitle = this.state.title.trim();
        if (trimTitle.length < 3) {
            this.setState({
                titleStatus: 'error'
            });
            return false;
        } else {
            this.setState({
                titleStatus: 'default'
            });
            return true;
        }
    }

    /**
     * Checks date for valid.
     * @returns {boolean} is date valid?
     * @constructor
     */
    CheckDate() {
        let date = new Date(this.state.date);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
            this.setState({
                dateStatus: 'error'
            });
            return false;
        } else {
            this.setState({
                dateStatus: 'default'
            });
            return true;
        }
    }

    /**
     * Initialize private checkbox, based on props.
     * @param ref reference to checkbox input.
     * @constructor
     */
    InitPrivate(ref) {
        if (ref) {
            if (this.state.private) {
                ref.childNodes[0].setAttribute('checked', true);
            } else {
                ref.childNodes[0].removeAttribute('checked');
            }
        }
    }

    /**
     * Triggers when user pressed a "Create" button.
     */
    onSubmit() {
        let isTitleValid = this.CheckTitle();
        let isDateValid = this.CheckDate();
        if (isTitleValid && isDateValid) {
            if (this.props.onSubmit) {
                this.props.onSubmit({
                    title: this.state.title,
                    date: this.state.date,
                    private: this.state.private,
                    max_movies: this.state.maxMovies,
                    info: this.state.info
                });
            }
        }
    }

    render() {
        const {title} = this.state;

        const dates = this.GetDates();
        const datesOptions = [];
        for (let val in dates) {
            datesOptions.push(<option key={val} value={val}>{dates[val]}</option>);
        }

        return (
            <FormLayout>
                <Input
                    type={"text"}
                    top={"Название"}
                    value={title}
                    name={"title"}
                    bottom={this.state.titleStatus === "error" ? "Название должно содержать минимум 3 символа." : ''}
                    status={this.state.titleStatus}
                    onChange={this.onChange}
                    placeholder={"Введите название"}
                />
                <Select
                    top={"Дата проведения"}
                    name={'date'}
                    onChange={this.onChange}
                    defaultValue={this.props.date}
                    placeholder={"Выберите дату"}
                    bottom={this.state.dateStatus === "error" ? "Выберите дату проведения" : ''}
                    status={this.state.dateStatus}
                >
                    {datesOptions}
                </Select>
                <Slider
                    top={"Ограничение битвы фильмов"}
                    step={1}
                    min={0}
                    max={5}
                    name={"maxMovies"}
                    onChange={value => {this.onChangeMaxMovies(value)}}
                    defaultValue={this.state.maxMovies}
                />
                <Div style={{paddingTop: 0}}>
                    <p style={{marginTop: 0, marginBottom: 0, fontSize: '0.9em', lineHeight: '1.2em'}}>
                        Не более {`${this.state.maxMovies} ${declOfNum(this.state.maxMovies, ['фильма', 'фильмов', 'фильмов'])}`} с человека.
                    </p>
                </Div>
                <Textarea top={"Дополнительная информация"}
                          defaultValue={this.props.info}
                          name={"info"}
                          onChange={this.onChange}
                          placeholder={"Например, адрес вечеринки"}/>
                <Checkbox getRootRef={this.InitPrivate} onClick={() => {
                    this.setState(prevState => {
                        return ({private: !prevState.private})
                    })
                }}>
                    Приватная вечеринка
                </Checkbox>
                <Button size={"xl"} onClick={this.onSubmit}>{this.props.submitButtonText}</Button>
            </FormLayout>
        )
    }
}

CreatePartyForm.propTypes = {
    onSubmit: PropTypes.func,
    title: PropTypes.string,
    date: PropTypes.string,
    private: PropTypes.bool,
    submitButtonText: PropTypes.string
};

CreatePartyForm.defaultProps = {
    submitButtonText: 'Создать'
};

export default CreatePartyForm;