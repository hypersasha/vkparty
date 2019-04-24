import React, {Component} from 'react';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24LogoVk from '@vkontakte/icons/dist/24/logo_vk';

import {Avatar, Cell, Footer, Group, HeaderButton, List, Panel, PanelHeader} from "@vkontakte/vkui/src";

import './homescreen.less';

class HomeScreen extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <PanelHeader
                    left={<HeaderButton onClick={() => { this.props.onChangeView('newParty'); }}><Icon24Add/></HeaderButton>}>
                    <div className="rave--header-title">
                        <Icon24LogoVk/>
                        <span>Rave</span>
                    </div>
                </PanelHeader>
                <Group title={"Грядущие вечеринки"}>
                    <List>
                        <Cell
                            before={<Avatar
                                type={"image"}
                                src={"https://www.tasteofhome.com/wp-content/uploads/2017/10/Six-Layer-Dinner_exps6019_W101973175B07_06_3bC_RMS-2.jpg"}
                                size={72}/>}
                            expandable={true}
                            size="l"
                            description={"Николай Таранов"}
                            bottomContent={
                                <div className="rave--event-date">В эту пятницу, 22 апр.</div>
                            }
                        >
                            Кукинг стрэм
                        </Cell>
                        <Cell
                            before={<Avatar
                                type={"image"}
                                className={"rave-preview-pic"}
                                src={"https://cs.pikabu.ru/post_img/2013/06/14/11/1371231426_2070153925.jpg"}
                                size={72}/>}
                            expandable={true}
                            size="l"
                            description={"Артем Скачков"}
                            bottomContent={
                                <div className="rave--event-date">В след. субботу, 5 май</div>
                            }
                        >
                            Вечер кино
                        </Cell>
                    </List>
                </Group>
                <Footer>2 вечеринки</Footer>
                <Group title={"Воспоминания"}>
                    <List>
                        <Cell
                            before={<Avatar
                                type={"image"}
                                src={"https://www.tasteofhome.com/wp-content/uploads/2017/10/exps28800_UG143377D12_18_1b_RMS-696x696.jpg"}
                                size={48}/>}
                            expandable={true}
                            size="m"
                            description={"В прошлую среду"}
                        >
                            ТЫ + Бургер
                        </Cell>
                        <Cell
                            before={<Avatar
                                type={"image"}
                                src={"https://www.smileexpo.ru/public/upload/news/poker_v_kazahstane_14346151523064_image.jpg"}
                                size={48}/>}
                            expandable={true}
                            size="m"
                            description={"два месяца назад"}
                        >
                            Покер Старз
                        </Cell>
                    </List>
                </Group>
                <Footer>2 вечеринки</Footer>
            </div>
        )
    }

}

export default HomeScreen;