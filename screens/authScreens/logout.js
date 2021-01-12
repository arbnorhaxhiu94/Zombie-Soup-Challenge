// this function can be found in today.js line 145

export const logout = async(token, logthefuckout) => {
    // const config = {
    //     headers: { Authorization: `Bearer ${token}` }
    // };
    console.log('logout is called')
    console.log(this.state.token)
    await axios.post(
        'https://tasker.zombiesoup.co/api/auth/logout', null, { 
        headers: { 
            'Authorization': 'Bearer '+token 
        }
    })
    .then(() => logthefuckout())
    .catch(error => {
        console.log('fail')
        console.log(error.response.data)
    });
}