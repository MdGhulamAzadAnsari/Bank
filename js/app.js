//////////////////////////////////////////////////
// UI CONTROLLER
var UIController = (function() {
  //////////////////////////////////////////////////
  // PAGES

  var DOMString = {
    main__bank: ".main__bank-about",
    signup: ".sign-up",
    login: ".login",
    userPage: ".user-info",
    rname: "#rname",
    rusername: "#rusername",
    remail: "#remail",
    rpassword: "#rpassword",
    rcpassword: "#rcpassword",
    nameError: "#name-error",
    usernameError: "#username-error",
    emailError: "#email-error",
    passwordError: "#rpassword-error",
    confirmPasswordError: "#rcpassword-error",
    loginEmail: "#email",
    loginPassword: "#password",
    loginEmailError: "#email_error",
    loginPasswordError: "#password_error",
    paymentOption: "#option",
    paymentDecription: "#description",
    paymentAmount: "#amount",
    paymentError: "#paymentError",
    accountHolderName: "#account-holder-name",
    accountNumber: "#user-account",
    accountBalance: "#user-balance",
    newAccountNo: "#new-account"
  };

  var mainBankAbout = document.querySelector(DOMString.main__bank);
  var signup = document.querySelector(DOMString.signup);
  var login = document.querySelector(DOMString.login);
  var userMainPage = document.querySelector(DOMString.userPage);
  function removePreviousData() {
    var historyView = document.querySelector(".user-info__history");
    var child = historyView.lastElementChild;
    while (child.className !== "user-info__column") {
      historyView.removeChild(child);
      child = historyView.lastElementChild;
    }
  }
  return {
    showLoginPage: function() {
      login.classList.remove("hide");
      mainBankAbout.classList.add("hide");
      signup.classList.add("hide");
      userMainPage.classList.add("hide");
    },
    showRegisterPage: function() {
      signup.classList.remove("hide");
      mainBankAbout.classList.add("hide");
      login.classList.add("hide");
      userMainPage.classList.add("hide");
    },
    showUserMainPage: function() {
      userMainPage.classList.remove("hide");
      mainBankAbout.classList.add("hide");
      signup.classList.add("hide");
      login.classList.add("hide");
    },
    getRegisterationFormData: function() {
      let acNo = document.querySelector(DOMString.newAccountNo);
      let rname = document.querySelector(DOMString.rname);
      let username = document.querySelector(DOMString.rusername);
      let email = document.querySelector(DOMString.remail);
      let password = document.querySelector(DOMString.rpassword);
      let confirmPassword = document.querySelector(DOMString.rcpassword);
      return [acNo, rname, username, email, password, confirmPassword];
    },
    getDOMString: function() {
      return DOMString;
    },
    setAccountDetail: function() {
      // Remove previous customer data
      removePreviousData();

      // set current customer data
      let holderName = document.querySelector(DOMString.accountHolderName);
      let acNumber = document.querySelector(DOMString.accountNumber);
      let accountBalance = document.querySelector(DOMString.accountBalance);
      let customer = Controller.currentCustomer();
      holderName.innerHTML = customer.name;
      acNumber.innerHTML = customer.ac;
      accountBalance.innerHTML = customer.balance;
      let customerHistory = BOController.getCustomersHistory(customer.ac);
      if (customerHistory) {
        customerHistory.forEach(newDivHtml => {
          document
            .querySelector(".user-info__history")
            .insertAdjacentHTML("beforeend", newDivHtml);
        });
      }
    },
    updateBalance: function(balance) {
      document.querySelector(DOMString.accountBalance).innerHTML = balance;
    }
  };
})();

//////////////////////////////////////////////////
// BO CONTROLLER
var BOController = (function() {
  //////////////////////////////////////////////////
  // STORE ALL CUSTOMER DATA
  var customers = [];
  var customersHistory = {};

  return {
    getCustomers: function() {
      return customers;
    },
    addCustomer: function(customer) {
      customers.push(customer);
    },
    getNewAccountNo: function() {
      return customers.length + 1;
    },
    getCustomersHistory: function(ac) {
      return customersHistory[ac];
    },
    addCustomersHistory: function(ac, customerHistory) {
      let histories = customersHistory[ac];
      if (histories) {
        customersHistory[ac].push(customerHistory);
      } else {
        customersHistory[ac] = [];
        customersHistory[ac].push(customerHistory);
      }
    },
    isValidUser: function(email, password) {
      if (customers.length > 0) {
        let validUser = customers.filter(customer => {
          return customer.email == email && customer.password == password;
        });
        if (validUser.length > 0) {
          Controller.assignCurrentCustomer(validUser[0]);
          return [true, true];
        } else {
          return [false, false];
        }
      }
      return [false, false];
    }
  };
})();

//////////////////////////////////////////////////
// GLOBAL APP CONTROLLER
var Controller = (function(UIController, BOController) {
  // Store Login User Data
  var currentCustomer;

  var DOMString = UIController.getDOMString();
  var Customer = function(ac, name, username, email, password, balance = 0) {
    this.ac = ac;
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.balance = balance;
  };

  function isValid(name, username, email, password, cpassword) {
    let nameError = document.querySelector(DOMString.nameError);
    let usernameError = document.querySelector(DOMString.usernameError);
    let emailError = document.querySelector(DOMString.emailError);
    let passwordError = document.querySelector(DOMString.passwordError);
    let confirmPasswordError = document.querySelector(
      DOMString.confirmPasswordError
    );

    if (!/[a-zA-Z_ .]{2,26}/.test(name.value)) {
      nameError.innerHTML = "Please enter valid name";
      nameError.style.display = "inherit";
      name.focus();
      setTimeout(() => {
        nameError.style.display = "none";
      }, 5000);
      return false;
    }
    if (!/[a-zA-Z_0-9]{1,20}/.test(username.value)) {
      usernameError.innerHTML = "Please enter valid username";
      usernameError.style.display = "inherit";
      username.focus();
      setTimeout(() => {
        usernameError.style.display = "none";
      }, 5000);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email.value)) {
      emailError.innerHTML = "Please enter valid username";
      emailError.style.display = "inherit";
      email.focus();
      setTimeout(() => {
        emailError.style.display = "none";
      }, 5000);
      return false;
    }
    if (
      !/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{10,20})/.test(
        password.value
      )
    ) {
      passwordError.innerHTML = "Please enter valid password";
      passwordError.style.display = "inherit";
      password.focus();
      setTimeout(() => {
        passwordError.style.display = "none";
      }, 5000);
      return false;
    }

    if (password.value != cpassword.value) {
      confirmPasswordError.innerHTML = "Password not match";
      confirmPasswordError.style.display = "inherit";
      rcpassword.focus();
      setTimeout(() => {
        confirmPasswordError.style.display = "none";
      }, 5000);
      return false;
    }
    return true;
  }

  function clear(...fields) {
    fields[0].focus();
    fields.forEach(e => {
      e.value = "";
    });
  }

  return {
    currentCustomer: function() {
      return currentCustomer;
    },
    assignCurrentCustomer: function(customer) {
      currentCustomer = customer;
    },
    setNewAccountNo: function() {
      document.querySelector(
        DOMString.newAccountNo
      ).innerHTML = BOController.getNewAccountNo();
    },
    registerCustomer: function() {
      [
        acNo,
        rname,
        rusername,
        remail,
        rpassword,
        rconfirmPassword
      ] = UIController.getRegisterationFormData();

      if (isValid(rname, rusername, remail, rpassword, rconfirmPassword)) {
        BOController.addCustomer(
          new Customer(
            acNo.innerHTML,
            rname.value,
            rusername.value,
            remail.value,
            rpassword.value
          )
        );
        document.querySelector(".msgSuccessful").style.display = "block";
        setTimeout(() => {
          document.querySelector(".msgSuccessful").style.display = "none";
        }, 1000);
        Controller.setNewAccountNo();
        clear(rname, rusername, remail, rpassword, rconfirmPassword);
      }
    },
    isValidLogin: function() {
      let email = document.querySelector(DOMString.loginEmail);
      let password = document.querySelector(DOMString.loginPassword);
      let emailError = document.querySelector(DOMString.loginEmailError);
      let passwordError = document.querySelector(DOMString.loginPasswordError);

      if (email.value == "") {
        emailError.innerHTML = "Please enter email";
        emailError.style.display = "inherit";
        email.focus();
        setTimeout(() => {
          emailError.style.display = "none";
        }, 5000);
        return false;
      }
      if (password.value == "") {
        passwordError.innerHTML = "Please enter  password";
        passwordError.style.display = "inherit";
        password.focus();
        setTimeout(() => {
          passwordError.style.display = "none";
        }, 5000);
        return false;
      }

      [reg_email, reg_pass] = BOController.isValidUser(
        email.value,
        password.value
      );

      if (reg_email == false) {
        emailError.innerHTML = "Please enter valid email";
        emailError.style.display = "inherit";
        email.focus();
        setTimeout(() => {
          emailError.style.display = "none";
        }, 5000);
        return false;
      }
      if (reg_pass == false) {
        passwordError.innerHTML = "Please enter valid password";
        passwordError.style.display = "inherit";
        password.focus();
        setTimeout(() => {
          passwordError.style.display = "none";
        }, 5000);
        return false;
      }
      email.value = "";
      password.value = "";
      return true;
    },
    addHistory: function() {
      let paymentOption = document.querySelector(DOMString.paymentOption);
      let paymentDecr = document.querySelector(DOMString.paymentDecription);
      let paymentAmount = document.querySelector(DOMString.paymentAmount);
      let paymentError = document.querySelector(DOMString.paymentError);

      if (paymentOption[paymentOption.selectedIndex].value == "none") {
        paymentError.innerHTML = "Please select option";
        paymentError.style.display = "inherit";
        paymentOption.focus();
        setTimeout(() => {
          paymentError.style.display = "none";
        }, 5000);
        return;
      }

      if (paymentDecr.value == "") {
        paymentError.innerHTML = "Please enter decription";
        paymentError.style.display = "inherit";
        paymentOption.focus();
        setTimeout(() => {
          paymentError.style.display = "none";
        }, 5000);
        return;
      }
      if (paymentAmount.value == "") {
        paymentError.innerHTML = "Please enter amount";
        paymentError.style.display = "inherit";
        paymentOption.focus();
        setTimeout(() => {
          paymentError.style.display = "none";
        }, 5000);
        return;
      }
      if (paymentAmount.value <= 0) {
        paymentError.innerHTML = "Amount should be greater than than zero";
        paymentError.style.display = "inherit";
        paymentOption.focus();
        setTimeout(() => {
          paymentError.style.display = "none";
        }, 5000);
        return;
      }

      let newDivHtml;
      if (paymentOption[paymentOption.selectedIndex].value == "Deposit") {
        newDivHtml = `<div class="user-info__depositHistory">
                      <p>${new Date().toLocaleDateString()}</p>
                      <p>${paymentDecr.value}</p>
                      <p>${paymentAmount.value}</p>
                      <p></p>
                      <p>${(currentCustomer["balance"] += Number(
                        paymentAmount.value
                      ))}</p>
                      </div>`;
      } else if (
        paymentOption[paymentOption.selectedIndex].value == "Withdraw"
      ) {
        if (paymentAmount.value > currentCustomer["balance"]) {
          paymentError.innerHTML = "Insufficient balance";
          paymentError.style.display = "inherit";
          paymentOption.focus();
          setTimeout(() => {
            paymentError.style.display = "none";
          }, 5000);
          return;
        }
        newDivHtml = `<div class="user-info__withdrawHistory">
                      <p>${new Date().toLocaleDateString()}</p>
                      <p>${paymentDecr.value}</p>
                      <p></p>
                      <p>${paymentAmount.value}</p>
                      <p>${(currentCustomer["balance"] -= Number(
                        paymentAmount.value
                      ))}</p>
                      </div>`;
      }

      document
        .querySelector(".user-info__history")
        .insertAdjacentHTML("beforeend", newDivHtml);
      BOController.addCustomersHistory(currentCustomer.ac, newDivHtml);
      UIController.updateBalance(currentCustomer["balance"]);
      paymentDecr.value = "";
      paymentAmount.value = "";
    }
  };
})(UIController, BOController);

//////////////////////////////////////////////////
// START
function showLoginPage() {
  UIController.showLoginPage();
}

function showRegisterPage() {
  Controller.setNewAccountNo();
  UIController.showRegisterPage();
}

function registerCustomer() {
  Controller.registerCustomer();
}

function login() {
  if (Controller.isValidLogin()) {
    UIController.setAccountDetail();
    UIController.showUserMainPage();
  }
}

function addHistory() {
  Controller.addHistory();
}
