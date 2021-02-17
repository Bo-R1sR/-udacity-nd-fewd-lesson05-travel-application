import { handleInputFormSubmission } from './js/app'

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inputForm").addEventListener("submit", handleInputFormSubmission);
    document.getElementById("locationResult").style.display = "none";
    document.getElementById("weatherResult").style.display = "none";
    document.getElementById("weatherForecastResult").style.display = "none";
});

import './styles/resets.scss'
import './styles/base.scss'
import './styles/weather.scss'
import './styles/form.scss'
import './styles/header.scss'

export {
    handleInputFormSubmission
}
