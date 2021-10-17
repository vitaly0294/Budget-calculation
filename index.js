'use strict'
document.addEventListener('DOMContentLoaded', () => {

  let salaryAmountInput = document.querySelector('.salary-amount'),                        


      addIncomeBtn = document.querySelectorAll('button')[0],                              
      incomeItems = document.querySelectorAll('.income-items'),

      additionalIncomeInput = document.querySelectorAll('.additional_income-item'),        

      addExpensesBtn = document.querySelectorAll('button')[1],                             
      expensesItems = document.querySelectorAll('.expenses-items'),

      additionalExpensesItemInput = document.querySelector('.additional_expenses-item'),   

      depositCheckbox = document.querySelector('#deposit-check'),                          
      depositBank = document.querySelector('.deposit-bank'),
      depositAmount = document.querySelector('.deposit-amount'),
      depositPercent = document.querySelector('.deposit-percent'),

      targetAmountInput = document.querySelector('.target-amount'),                        

      periodSelectRange = document.querySelector('.period-select'),                        

      budgetMonthValue = document.querySelector('.budget_month-value'),                    
      budgetDayValue = document.querySelector('.budget_day-value'),                        
      expensesMonthValue = document.querySelector('.expenses_month-value'),                
      additionalIncomeValue = document.querySelector('.additional_income-value'),          
      additionalExpensesValue = document.querySelector('.additional_expenses-value'),      
      incomePeriodValue = document.querySelector('.income_period-value'),                  
      targetMonthValue = document.querySelector('.target_month-value'),                    

      startBtn = document.getElementById('start'),                                         
      cancelBtn = document.getElementById('cancel'),                                        

      placeholderName = document.querySelectorAll('[placeholder="Наименование"]'),
      placeholderNum = document.querySelectorAll('[placeholder="Сумма"]'),
      placeholderProcent = document.querySelector('[placeholder="Процент"]')


  class AppData {

    constructor(budget = 0, budgetDay = 0, budgetMonth = 0, expensesMonth = 0, income = {}, incomeMonth = 0, addIncome = [], expenses = {}, addExpenses = [], deposit = false, percentDeposit = 0, moneyDeposit = 0) {
      this.budget = budget                    
      this.budgetDay = budgetDay              
      this.budgetMonth = budgetMonth          
      this.expensesMonth = expensesMonth      
      this.income = income                    
      this.incomeMonth = incomeMonth          
      this.addIncome = addIncome
      this.expenses = expenses                
      this.addExpenses = addExpenses          
      this.deposit = deposit                  
      this.percentDeposit = percentDeposit    
      this.moneyDeposit = moneyDeposit        
    }

    start() {

      this.budget = +salaryAmountInput.value
      this.getExpInc(expensesItems, 'expenses', this.expenses)
      this.getExpInc(incomeItems, 'income', this.income)

      this.expensesMonth = this.getIncExpMonth(this.expenses, this.expensesMonth)
      this.incomeMonth = this.getIncExpMonth(this.income, this.incomeMonth)

      this.getAddExpenses()
      this.getAddIncome()

      this.getInfoDeposit()

      this.getBudget()
      this.showResult()
      this.block()
      this.setLocalStorageData()
      this.setAllCookie()
    }  

    checkName() {
      placeholderName = document.querySelectorAll('[placeholder="Наименование"]')
      placeholderName.forEach(input => {
        input.addEventListener('input', function() {
          input.value = input.value.replace(/[^а-яёА-ЯЁ]/, '')
        })
      })
    
      placeholderNum = document.querySelectorAll('[placeholder="Сумма"]')
      placeholderNum.forEach(input => {
        input.addEventListener('input', function() {
          input.value = input.value.replace(/[^0-9]/, '')
        })
      })

      placeholderProcent = document.querySelector('[placeholder="Процент"]')
      placeholderProcent.addEventListener('input', () => {
        placeholderProcent.maxLength = 3
        placeholderProcent.value = placeholderProcent.value.replace(/[^0-9]/, '')
        if ((placeholderProcent.value >= 0) && (100 >= placeholderProcent.value)) {
          if (salaryAmountInput.value !== '') {
            startBtn.removeAttribute('disabled')
          }
        } else {
          startBtn.setAttribute('disabled', 'true')
          alert('Введите корректные данные депозита!')
        }
      })
    }

    block() {
      document.querySelectorAll('[type=text]').forEach((input) => {
        input.setAttribute('disabled', 'true')
      }, this)
    
      document.querySelectorAll('button').forEach((btn, i) => {
        if (i !== 3) {
          btn.setAttribute('disabled', 'true')
        }
      }, this)
    
      depositCheckbox.setAttribute('disabled', 'true')
      depositBank.setAttribute('disabled', 'true')
      depositAmount.setAttribute('disabled', 'true')
      depositPercent.setAttribute('disabled', 'true')
    
      startBtn.style.display = 'none'
      cancelBtn.style.display = 'block'
    }

    reset() {
      incomeItems = document.querySelectorAll('.income-items')
      if (incomeItems.length > 1) {
        for (let i = 1; i < incomeItems.length; i++) {
          incomeItems[i].remove()
        }
      }
    
      expensesItems = document.querySelectorAll('.expenses-items')
      if (expensesItems.length > 1) {
        for (let i = 1; i < expensesItems.length; i++) {
          expensesItems[i].remove()
        }
      }
    
      document.querySelectorAll('[type=text]').forEach((input) => {
        input.removeAttribute('disabled')
        input.value = ''
      }, this)
    
      document.querySelectorAll('button').forEach((btn, i) => {
        if (i !== 3) {  
          if (i !== 2) {
            btn.removeAttribute('disabled')
          } 
          btn.style.display = 'block'
        } else {
          cancelBtn.style.display = 'none'
        }
      }, this)

      depositCheckbox.checked = false
      depositCheckbox.removeAttribute('disabled')
      depositBank.style.display = 'none'
      depositBank.removeAttribute('disabled')
      depositAmount.style.display = 'none'
      depositAmount.removeAttribute('disabled')
      depositPercent.style.display = 'none'
      depositPercent.removeAttribute('disabled')

      depositBank.value = ''
      depositAmount.value = ''
      depositPercent.value = ''
      
      this.budget = 0
      this.budgetDay = 0
      this.budgetMonth = 0
      this.expensesMonth = 0
      this.income = {}
      this.incomeMonth = 0
      this.addIncome = []
      this.expenses = {}
      this.addExpenses = []
      this.deposit = false
      this.percentDeposit = 0
      this.moneyDeposit = 0
    
      periodSelectRange.value = 1
      this.getPeriodSelect()
      
      localStorage.removeItem('localStorageData')
      this.delAllCookie()
    }

    setLocalStorageData() {
      localStorage.setItem('localStorageData', JSON.stringify(this))
    }

    getlocalStorageData() {
      
      let {budget, budgetDay, budgetMonth, expensesMonth, income, incomeMonth, addIncome, expenses, addExpenses, deposit, percentDeposit, moneyDeposit} = JSON.parse(localStorage.getItem('localStorageData'))
      
      this.budget = budget
      this.budgetDay = budgetDay
      this.budgetMonth = budgetMonth
      this.expensesMonth = expensesMonth
      this.income = income
      this.incomeMonth = incomeMonth
      this.addIncome = addIncome
      this.expenses = expenses
      this.addExpenses = addExpenses
      this.deposit = deposit
      this.percentDeposit = percentDeposit
      this.moneyDeposit = moneyDeposit
    }

    setAllCookie() {
      for (const key in this) {
        if (Object.hasOwnProperty.call(this, key)) {
          this.setCookies(JSON.stringify(key), JSON.stringify(this[key]))
        }
      }
      this.setCookies(JSON.stringify('isLoad'), JSON.stringify(true))
    }

    setCookies(key, value, year = 2050, month = 1, day = 0, path, domain, secure) {

      let cookieData = `${encodeURI(key)}=${encodeURI(value)}`

      cookieData += year ? `; expires=${(new Date(year, month - 1, day)).toGMTString()}` : ''
      cookieData += path ? `; path=${encodeURI(path)}` : ''
      cookieData += domain ? `; domain=${encodeURI(domain)}` : ''
      cookieData += secure ? '; secure' : ''
      document.cookie = cookieData
    }
    
    getAllCookie() {
          
      let cookiesData = {},
          key,
          value

      document.cookie.split('; ').forEach(item => {
        decodeURI(item).split('=').forEach((item, i) => {

          i === 0 ? key = JSON.parse(item) : value = JSON.parse(item)
          key !== 'isLoad' ? cookiesData[key] = value : ''

        })
      })
      return cookiesData
    }  

    delAllCookie() {
      let delCookies = this.getAllCookie()
      for (const key in delCookies) {
        if (Object.hasOwnProperty.call(delCookies, key)) {
          this.setCookies(JSON.stringify(key), JSON.stringify(delCookies[key]), 1950)
        }
      }
      this.setCookies(JSON.stringify('isLoad'), JSON.stringify(true), 1950)
    }

    addIncExpBlock(itemsElem, itemBtn, itemInput) {
      const clone = itemsElem[0].cloneNode(true)
      clone.querySelectorAll('input').forEach((item) => {
        item.value = ''
      })
      itemsElem[0].parentNode.insertBefore(clone, itemBtn)
      itemsElem = document.querySelectorAll(`.${itemInput}-items`) 
      if (itemsElem.length === 3) {
        itemBtn.style.display = 'none'
      }
      this.checkName()
    }

    getExpInc(itemsElem, itemInput, typeIncExp) {
      itemsElem = document.querySelectorAll(`.${itemInput}-items`)
      itemsElem.forEach((elem) => {
        const item = elem.querySelector(`.${itemInput}-title`).value
        const cash = elem.querySelector(`.${itemInput}-amount`).value
        if (item !== '' && cash !== '') {
          typeIncExp[item] = +cash
        }
      })
    }

    getIncExpMonth(itemsElem, item) {
      for (const key in itemsElem) {
        if (Object.hasOwnProperty.call(itemsElem, key)) {
          item += itemsElem[key]
        }
      }
      return item
    }

    getAddIncome() {
      additionalIncomeInput.forEach(function(item) {
        const itemValue = item.value.trim()
        if (itemValue !== '') {
          this.addIncome.push(itemValue)
        }
      }, this)
    }  
    
    getAddExpenses() {
      const addExpenses = additionalExpensesItemInput.value.split(',')
      addExpenses.forEach(function(item) {
        item = item.trim()
        if (item !== '') {
          this.addExpenses.push(item)
        }
      }, this)
    }

    getTargetMonth() {
      return  targetAmountInput.value/this.budgetMonth
    }
    
    calcSavedMoney() {
      return Math.floor(this.budgetMonth * periodSelectRange.value)
    }
    
    getPeriodSelect() {
      periodSelectRange.nextElementSibling.textContent = periodSelectRange.value
    }
    
    getBudget() {
      const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100) 
      this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit
      this.budgetDay = Math.floor(this.budgetMonth / 30)
    }

    getInfoDeposit() {
      if (this.deposit) {
        this.percentDeposit = depositPercent.value
        this.moneyDeposit = depositAmount.value
      }
    }

    changePercent() {
      const valueSelect = this.value
      if (valueSelect === 'other') {
        depositPercent.style.display = 'inline-block'
        depositPercent.value = ''
      } else {
        depositPercent.style.display = 'none'
        depositPercent.value = valueSelect
      }
    }

    depositHandler() {
      if (depositCheckbox.checked) {
        depositBank.style.display = 'inline-block'
        depositAmount.style.display = 'inline-block'
        depositPercent.style.display = 'none'
        this.deposit = true
        depositBank.addEventListener('change', this.changePercent)
      } else {
        depositBank.style.display = 'none'
        depositAmount.style.display = 'none'
        depositPercent.style.display = 'none'

        depositBank.value = ''
        depositAmount.value = ''
        this.deposit = false
        depositBank.removeEventListener('change', this.changePercent)
      }
    }
    
    showResult() {
      budgetMonthValue.value = this.budgetMonth
      budgetDayValue.value = this.budgetDay
      expensesMonthValue.value = this.expensesMonth
      additionalExpensesValue.value = this.addExpenses.join(', ')
      additionalIncomeValue.value = this.addIncome.join(', ')
      targetMonthValue.value = Math.ceil(this.getTargetMonth())
      incomePeriodValue.value = this.calcSavedMoney()
      periodSelectRange.addEventListener('input', () => {
        incomePeriodValue.value = this.calcSavedMoney()
      })
    }

    eventsListeners() {
      if (localStorage.length !== 0) {
        this.block()

        if (localStorage.getItem('localStorageData') === JSON.stringify(this.getAllCookie())) {
          this.getlocalStorageData()
          this.showResult()
        } else {
          this.reset()
        }

      }
      startBtn.setAttribute('disabled', 'true')
      this.checkName()
    
      salaryAmountInput.addEventListener('input', () => {
        if (salaryAmountInput.value && (placeholderProcent.value >= 0) && (100 >= placeholderProcent.value)) {
        startBtn.removeAttribute('disabled')
        } else {
          startBtn.setAttribute('disabled', 'true')
        }
      })
      startBtn.addEventListener('click', this.start.bind(this))
      addExpensesBtn.addEventListener('click', this.addIncExpBlock.bind(this, expensesItems, addExpensesBtn, 'expenses'))
      addIncomeBtn.addEventListener('click', this.addIncExpBlock.bind(this, incomeItems, addIncomeBtn, 'income'))
      periodSelectRange.addEventListener('input', this.getPeriodSelect)
      depositCheckbox.addEventListener('change', this.depositHandler.bind(this))
      cancelBtn.addEventListener('click', this.reset.bind(this))
    }
    
  }

  const appData = new AppData()

  appData.eventsListeners()

})
