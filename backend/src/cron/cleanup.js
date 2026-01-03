import cron from "node-cron";
import { User } from "../models/user.model.js";

const schedule = process.env.CLEANUP_CRON_SCHEDULE || "0 0 * * *";

//Run everyday at midnight (00:00)
cron.schedule(schedule, async () => {
  console.log("Running automated dormant user cleanup task...");

  const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const permanentDeleteUsers = await User.find({
    isDeleted: true,
    deletedAt: { $lt: thirtyDays },
  });

  for (const user of permanentDeleteUsers) {
    await User.findByIdAndDelete(user._id);
    console.log(
      `Permanently delete user. id: ${user._id}, email: ${user.email}`,
    );
  }
});
