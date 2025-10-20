const { RequestQuery } = require("./services.controllers");

const showAllEmails = async (req, res) => {
  try {
    const data = await RequestQuery("select * from emails");
    res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internale server error" });
  }
};

const showEmailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await RequestQuery("select * from emails where id = ?", [id]);
    res.json(data.length > 0 ? data[0] : {});
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internale server error" });
  }
};

const UpdateAllPath = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }
    await RequestQuery("UPDATE  emails SET path_file = ? ", [req.file.path]);

    res.status(200).json({
      message: "PDF uploaded successfully",
      fileName: req.file.filename,
      filePath: req.file.path,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internale server error" });
  }
};

const InsertEmail = async (req, res) => {
  try {
    const { email, subject, content } = req.body;
    const bodies = [email, subject, content];

    await RequestQuery(
      "INSERT INTO emails ( email, subject, content ) VALUES(? , ? , ? )",
      bodies
    );
    return res
      .status(200)
      .send({ success: "Email demande created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internale server error" });
  }
};

const UpdatetEmail = async (req, res) => {
  try {
    const { id, email, subject, content } = req.body;
    const bodies = [email, subject, content, id];

    await RequestQuery(
      "UPDATE emails set  email =  ? , subject = ? , content = ? where id = ?",
      bodies
    );
    return res
      .status(200)
      .send({ success: "Email demande updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internale server error" });
  }
};
const DeleteEmail = async (req, res) => {
  try {
    const { id } = req.body;
    const bodies = [id];

    await RequestQuery("Delete from emails  where id = ?", bodies);
    return res.status(200).send({ success: "Email deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internale server error" });
  }
};

module.exports = {
  showAllEmails,
  InsertEmail,
  UpdatetEmail,
  DeleteEmail,
  showEmailsById,
  UpdateAllPath,
};
