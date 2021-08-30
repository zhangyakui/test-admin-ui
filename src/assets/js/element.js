import Vue from 'vue'
import {
    Container,
    Header,
    Aside,
    Main,
    Row,
    Col,
    Form,
    FormItem,
    Input,
    Button,
    Message,
    Menu,
    Submenu,
    MenuItem,
    Icon,
    Breadcrumb,
    BreadcrumbItem,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Tag,
    Link






} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Row);
Vue.use(Col);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Icon);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Tag);
Vue.use(Link);


// 提示类组件需挂载
Vue.prototype.$message = {
    info: msg => {
        Message({type: 'success', message: msg, duration: 5000});
    },
    success: msg => {
        Message({type: 'success', message: msg, duration: 2000});
    },
    error: msg => {
        Message({type: 'error', message: msg, duration: 3000});
    },
    warning: msg => {
        Message({type: 'warning', message: msg, duration: 3000});
    }
}

