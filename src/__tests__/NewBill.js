import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"

//import for test
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"

//import for integration test 
import BillsUI from "../views/BillsUI.js"
import firebase from "../__mocks__/firebase"


describe("Given I am connected as an employee", () => {
  describe("When I download a file with a good extention", () => {
    test("the submit button is available", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })

      const inputData = new File(["filetest"], 'filetest.jpeg', { type: "image/jpeg" })
      const filetest = screen.getByTestId("file")
      const btnSend = document.getElementById("btn-send-bill")
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      filetest.addEventListener("change", handleChangeFile)
      fireEvent.change(filetest, {
        target: {
          files: [inputData],
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(btnSend.disabled).not.toBeTruthy()
    })
  })
})

describe("When I download a file with bad extention", () => {
  test("the submit button is not clikable ", () => {
    const html = NewBillUI()
    document.body.innerHTML = html

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    const firestore = null
    const newBill = new NewBill({
      document,
      onNavigate,
      firestore,
      localStorage: window.localStorage
    })

    const inputData = new File(["filetest"], 'filetest.txt', { type: "image/txt" })
    const filetest = screen.getByTestId("file")
    const btnSend = document.getElementById("btn-send-bill")
    const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

    filetest.addEventListener("change", handleChangeFile)
    fireEvent.change(filetest, {
      target: {
        files: [inputData],
      }
    })
    expect(handleChangeFile).toHaveBeenCalled()
    expect(btnSend.disabled).toBeTruthy()
  })
})
