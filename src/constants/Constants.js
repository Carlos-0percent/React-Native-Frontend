export const OccupationConstant = [
    { name: "Salaried", value: "salaried" },
    { name: "Self Employed", value: "self employed" },
]

export const EmailValidator = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"

export const OnboardingStatus = {
    "PROFILE_PENDING": 1,
    "UNVERIFIED": 2,
    "ACTIVE": 3,
    "INACTIVE": 4
}

export const CreditScoreLevel = [
    { type: "POOR", maxScore: 559, minScore: 280, scoreRange: 280 },
    { type: "FAIR", maxScore: 659, minScore: 560, scoreRange: 100 },
    { type: "GOOD", maxScore: 724, minScore: 660, scoreRange: 65 },
    { type: "VERY GOOD", maxScore: 759, minScore: 725, scoreRange: 35 },
    { type: "EXCELLENT", maxScore: 850, minScore: 760, scoreRange: 91 },
    { type: "BLANK", maxScore: 850, minScore: 280, scoreRange: 0 },
]

export const Month = [
    { value: "01", key: "Jan", name: "January" },
    { value: "02", key: "Feb", name: "February" },
    { value: "03", key: "Mar", name: "March" },
    { value: "04", key: "Apr", name: "April" },
    { value: "05", key: "May", name: "May" },
    { value: "06", key: "Jun", name: "June" },
    { value: "07", key: "Jul", name: "July" },
    { value: "08", key: "Aug", name: "August" },
    { value: "09", key: "Sep", name: "September" },
    { value: "10", key: "Oct", name: "October" },
    { value: "11", key: "Nov", name: "November" },
    { value: "12", key: "Dec", name: "December" },
]

export const CreditFactorLevels = {
    "Payment_history": ["<97%", "97%", "98%", "99%", "100%"],
    "Utilization_history": ["75%+", "50-74%", "30-49%", "10-29%", "0-9%"],
    "Age_of_credit": ["<2", "2-4", "5-6", "7-8", "9+"],
    "Total_account_mix": ["0-5", "6-10", "", "11-20", "21+"],
    "New_inquires": [">9", "7", "5", "3", "1"],
}

export const DummyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." 
