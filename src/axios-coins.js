import axios from 'axios';

const instanse = axios.create({
    baseURL: 'https://dev.viaduct.pro/moonhubapp/wp-admin/admin-ajax.php'
});

export default instanse;