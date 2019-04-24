import React, {Component} from 'react';
import {
    Button,
    Checkbox,
    Div,
    Footer,
    FormLayout,
    Group,
    HeaderButton,
    Input,
    PanelHeader,
    Select
} from "@vkontakte/vkui/src";

import './addparty.less';

import Icon24LogoVk from '@vkontakte/icons/dist/24/logo_vk';

class AddParty extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            date: null,
            private: false
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const {name, value} = e.currentTarget;
        this.setState({
            [name]: value
        });
    }

    render() {

        const {title} = this.state;

        return(
            <div>
                <PanelHeader
                    left={<HeaderButton onClick={() => { this.props.onChangeView('homeScreen'); }}>Отмена</HeaderButton>}>
                    <div className="rave--header-title">
                        <Icon24LogoVk/>
                        <span>Rave</span>
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
                            onChange={this.onChange}
                            placeholder={"Введите название"}
                        />
                        <Select top={"Дата проведения"} name={'date'} onChange={this.onChange} placeholder={"Выберите дату"}>
                            <option value="24-04-2019">Сегодня, 24 апр.</option>
                            <option value="25-04-2019">Завтра, 25 апр.</option>
                            <option value="26-04-2019">Послезавтра, 26 апр.</option>
                        </Select>
                        <Checkbox>Приватная вечеринка</Checkbox>
                        <Button size={"xl"}>Создать</Button>
                    </FormLayout>
                </Group>
                <Footer>После создания вечеринки, Вы сможете пригласить в нее друзей.</Footer>
            </div>
        );
    }
}

export default AddParty;