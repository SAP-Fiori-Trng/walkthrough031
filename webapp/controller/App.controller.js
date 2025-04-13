sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "dw/ui5/walkthrough/08/model/Formatter",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/ObjectStatus",
  ],
  function (
    Controller,
    JSONModel,
    Formatter,
    Dialog,
    Button,
    mobileLibrary,
    List,
    StandardListItem,
    Table,
    Column,
    Text,
    ColumnListItem,
    Label,
    Filter,
    FilterOperator,
    MessageBox,
    ObjectStatus
  ) {
    "use strict";
    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;
    return Controller.extend("dw.ui5.walkthrough.08.controller.App", {
      // TODO
      /**
       * @override
       */
      formatter: Formatter,
      onInit: function () {
        // sap.ui.getCore().getEventBus().subscribe("dw.ui5.walkthrough.08", "sayHello",
        //   this.onSayHelloPress, this);
        this._oI18n = this.getOwnerComponent().getModel("i18n");
        // this._oJSONModel = this.getOwnerComponent().getModel();
        const oData = {
          editBtnState: false,
          aSelectedContextPath: [],
          selectedItems: [],
          selectedItem: {},
          editDialogTitle: "",
        };
        this._oViewModel = new JSONModel(oData);
        this.getView().setModel(this._oViewModel, "viewModel");
      },

      /**
       * @override
       */
      onAfterRendering: function () {
        //  let oSorter1 = new sap.ui.model.Sorter("ProductName", false, false, function(a, b) {
        //    return b.length - a.length; // 自定义比较逻辑
        //  });
        let fnGroup = function (oContext) {
          let price = oContext.getProperty("UnitPrice");
          return price > 20 ? "High" : "Low";
        };
        // let fnComparator = function (a, b) {
        //   return b.length - a.length; // 自定义比较逻辑
        // };
        let oSorter = new sap.ui.model.Sorter("UnitPrice", false, fnGroup);
        const oList = this.byId("idProductsList");
        oList.getBinding("items").sort(oSorter);
      },

      // onSayHelloPress: function () {
      //   const oResourceBundle = this._oI18n.getResourceBundle();
      //   let sRecipientName = this._oJSONModel.getProperty("/recipient/name");
      //   let sMsg = oResourceBundle.getText("helloMsg", [sRecipientName]);
      //   MessageToast.show(sMsg);
      // },

      onOpenDialogButtonPress: function () {
        if (!this._oDialog) {
          this._oDialog = this.loadFragment({
            name: "dw.ui5.walkthrough.08.fragment.HelloDialog",
          });
        }
        this._oDialog.then(
          function (oDialog) {
            this._oHelloDialog = oDialog;
            oDialog.open();
          }.bind(this)
        );
      },

      onCloseButtonPress: function (oEvent) {
        // this._oHelloDialog.close();
        let oCloseBtn = oEvent.getSource();
        oCloseBtn.getParent().close();
        // this.getView().byId("idhelloDialog").close();
      },

      onSubmitButtonPress: function () {
        let oJSONModel = this.getOwnerComponent().getModel();
        let sFullName = oJSONModel.getProperty("/userInfo/fullName");
        oJSONModel.setProperty("/recipient/name", sFullName);
        this._oHelloDialog.close();
      },

      onDialogAfterClose: function () {
        let oJSONModel = this.getOwnerComponent().getModel();
        oJSONModel.setProperty("/userInfo/fullName", "");
      },

      onProductsListSelectionChange: function (oEvent) {
        let oSource = oEvent.getSource();
        let aSelectedContextPath = oSource.getSelectedContextPaths();
        let aSelectedItem = oSource.getSelectedItems();
        this._oViewModel.setProperty(
          "/editBtnState",
          aSelectedItem.length === 1
        );
        this._updateSelectedItem2Model(aSelectedContextPath);
      },

      _updateSelectedItem2Model: function (aPath) {
        let aSelectedItem = [];
        let oProductModel = this.getView().getModel("products");
        this._oViewModel.setProperty("/aSelectedContextPath", aPath);
        aPath.forEach((path) => {
          aSelectedItem.push(oProductModel.getProperty(path));
        }, this);
        this._oViewModel.setProperty("/selectedItems", aSelectedItem);
        // this._oViewModel.setProperty("/selectedItem", aSelectedItem[0]);
      },

      onReviewItemsButtonPress: function (oEvent) {
        if (!this.oResponsivePaddingDialog) {
          this.oResponsivePaddingDialog = new Dialog({
            title: "Selected Items Review",
            contentWidth: "760px",
            contentHeight: "450px",
            resizable: true,
            draggable: true,
            content: this._createResponsiveTable(), //this._createList(),
            beginButton: new Button({
              type: ButtonType.Emphasized,
              text: "OK",
              press: function () {
                this.oResponsivePaddingDialog.close();
              }.bind(this),
            }),
            endButton: new Button({
              text: "Close",
              press: function () {
                this.oResponsivePaddingDialog.close();
              }.bind(this),
            }),
          });
          // Enable responsive padding by adding the appropriate classes to the control
          this.oResponsivePaddingDialog.addStyleClass(
            "sapUiResponsivePadding--content sapUiResponsivePadding--header sapUiResponsivePadding--footer sapUiResponsivePadding--subHeader"
          );
          //to get access to the controller's model
          this.getView().addDependent(this.oResponsivePaddingDialog);
        }
        this.oResponsivePaddingDialog.open();
      },

      _createList: function () {
        return new List({
          items: {
            path: "viewModel>/selectedItems",
            template: new StandardListItem({
              title: "{viewModel>ProductName}",
              counter: "{viewModel>UnitsInStock}",
            }),
          },
        });
      },

      _createResponsiveTable: function () {
        // 创建 Table 控件
        var oTable = new Table({
          headerText: "Selected Product(s)",
          columns: [
            new Column({
              header: new Label({ text: "Product Name" }), // 表头：Name
              width: "60%",
            }),
            new Column({
              header: new Label({ text: "Units In Stock" }), // 表头：Description
              width: "40%",
            }),
            new Column({
              header: new Label({ text: "Stauts" }), // 表头：Description
              width: "40%",
            }),
          ],
          items: {
            path: "viewModel>/selectedItems", // 绑定 JSONModel 中的数据
            template: new ColumnListItem({
              cells: [
                new Text({ text: "{viewModel>ProductName}" }), // 绑定 name 字段
                new Text({ text: "{viewModel>UnitsInStock}" }), // 绑定 description 字段
                new ObjectStatus({
                  text: { 
                    path: "viewModel>Discontinued", 
                    formatter: Formatter.statusText.bind(this)
                  },
                  state: "{=${viewModel>Discontinued} ? 'Error' : 'Success'}"
                })
              ]
            }),
          },
        });
        return oTable;
      },

      onEditButtonPress: function (oEvent) {
        let oResourceBundle = this._oI18n.getResourceBundle();

        let oSelectedItem = Object.assign({}, this._oViewModel.getProperty("/selectedItems")[0]);
        this._oViewModel.setProperty("/selectedItem", oSelectedItem);
        let sDialogTitle = oResourceBundle.getText("editDialogTitle", [
          this._oViewModel.getProperty("/selectedItem/ProductName"),
        ]);
        this._oViewModel.setProperty("/editDialogTitle", sDialogTitle);
        if (!this._oEditDialog) {
          this._oEditDialog = this.loadFragment({
            name: "dw.ui5.walkthrough.08.fragment.EditProductDialog",
          });
        }
        this._oEditDialog.then(
          function (oDialog) {
            this._oEditProductDialog = oDialog;
            oDialog.open();
          }.bind(this)
        );
      },

      onDialogEditBeforeOpen: function (oEvent) {
        // let oEvt = oEvent;
        let oInput = this.byId("idUnitsInStockInput");
        let sValueState = oInput.getValueState();
        if (sValueState == "Error") {
          this.byId("idUnitsInStockInput").fireChange();
        }
      },

      onSubmitStockQtyPress: function () {
        let oUpdatedData = this._oViewModel.getProperty("/selectedItem"),
          sPath = this._oViewModel.getProperty("/aSelectedContextPath")[0];
        let oInput = this.getView().byId("idUnitsInStockInput");
        if (!this._validateInput(oInput)) {
          this.getView().getModel("products").setProperty(sPath, oUpdatedData);
          this._oEditProductDialog.close();
        } else {
          MessageBox.alert(
            this._oI18n.getResourceBundle().getText("qtyInStockValidTxt")
          );
        }
      },

      onFilterProducts: function (oEvent) {
        // build filter array
        const aFilter = [];
        const sQuery = oEvent.getParameter("query");
        if (sQuery) {
          // aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
          aFilter.push(
            new Filter({
              filters: [
                new Filter({
                  path: "ProductName",
                  operator: FilterOperator.Contains,
                  value1: sQuery,
                }),
                new Filter({
                  path: "QuantityPerUnit",
                  operator: FilterOperator.Contains,
                  value1: sQuery,
                }),
              ],
              and: false,
            })
          );
        }
        // filter binding
        const oList = this.byId("idProductsList");
        const oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
      },

      onRowButtonPress: function (oEvent) {
        let oResourceBundle = this._oI18n.getResourceBundle();
        let oSource = oEvent.getSource();
        let sPath = oSource.getParent().getBindingContextPath();
        let oData = Object.assign({}, this.getView().getModel("products").getProperty(sPath));
        this._oViewModel.setProperty("/aSelectedContextPath", [sPath]);
        this._oViewModel.setProperty("/selectedItem", oData);
        let sDialogTitle = oResourceBundle.getText("editDialogTitle", [
          this._oViewModel.getProperty("/selectedItem/ProductName"),
        ]);
        this._oViewModel.setProperty("/editDialogTitle", sDialogTitle);
        if (!this._oEditDialog) {
          this._oEditDialog = this.loadFragment({
            name: "dw.ui5.walkthrough.08.fragment.EditProductDialog",
          });
        }
        this._oEditDialog.then(
          function (oDialog) {
            this._oEditProductDialog = oDialog;
            oDialog.open();
          }.bind(this)
        );
      },

      onUnitsInStockInputChange: function (oEvent) {
        let oInput = oEvent.getSource();
        this._validateInput(oInput);
      },

      _validateInput: function (oInput) {
        let reg = /^(0|[1-9]\d*)$/,
          sValueState = "None",
          bValidationError = false;
        if (!reg.test(oInput.getValue()) || oInput.getValue().length == 0) {
          sValueState = "Error";
          bValidationError = true;
        }
        oInput.setValueState(sValueState);
        return bValidationError;
      },
    });
  }
);
