class AppController {
  home(req, res) {
    res.status(200).send("Welcome to Chatt Instant Messaging");
  }
}

const appController = new AppController();
export default appController;