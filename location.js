import fetch from 'cross-fetch';

export const getLocation = async ip => (await fetch(`http://ip-api.com/json${ip ? `/${ip}` : ''}`)).json();
