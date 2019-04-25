import React, {Component} from 'react';
import {
    Button,
    Checkbox,
    Footer,
    FormLayout,
    Group,
    HeaderButton,
    Input,
    PanelHeader,
    Select
} from "@vkontakte/vkui/src";

import {getTextDate} from "../../../lib/Utils";

import './addparty.less';

import Icon24LogoVk from '@vkontakte/icons/dist/24/logo_vk';

class AddParty extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            date: null,
            private: false,
            titleStatus: 'default',
            dateStatus: 'default'
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
     * Triggers when user pressed a "Create" button.
     */
    onSubmit() {
        let isTitleValid = this.CheckTitle();
        let isDateValid = this.CheckDate();
        if (isTitleValid && isDateValid) {
            // Send request to the server via axios.
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
            <div>
                <PanelHeader
                    left={<HeaderButton onClick={() => {
                        this.props.onChangeView('homeScreen');
                    }}>Отмена</HeaderButton>}>
                    <div className="rave--header-title">
                        Новая вечеринка
                    </div>
                </PanelHeader>
                <Group>
                    <div className={'newRave-intro'}>
                        <div className="newRave-intro--icon"></div>
                        <div className="newRave-intro--description">
                            <p>Укажите название, дату и статус вечеринки. Затем, пригласите в неё друзей.</p>
                        </div>
                    </div>
                </Group>
                <Group title={"Создание вечеринки"}>
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
                            placeholder={"Выберите дату"}
                            bottom={this.state.dateStatus === "error" ? "Выберите дату проведения" : ''}
                            status={this.state.dateStatus}
                        >
                            {datesOptions}
                        </Select>
                        <Checkbox onClick={() => {
                            this.setState(prevState => {
                                return ({private: !prevState.private})
                            })
                        }}>
                            Приватная вечеринка
                        </Checkbox>
                        <Button size={"xl"} onClick={this.onSubmit}>Создать</Button>
                    </FormLayout>
                </Group>
                <Footer>После создания вечеринки, Вы сможете пригласить в нее друзей.</Footer>
            </div>
        );
    }
}

export default AddParty;