-- DropForeignKey
ALTER TABLE "tracker_records" DROP CONSTRAINT "tracker_records_source_entry_id_fkey";

-- AddForeignKey
ALTER TABLE "tracker_records" ADD CONSTRAINT "tracker_records_source_entry_id_fkey" FOREIGN KEY ("source_entry_id") REFERENCES "entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
