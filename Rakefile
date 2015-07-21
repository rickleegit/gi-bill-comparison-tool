class String
  def colorize(c); "\e[#{c}m#{self}\e[0m" end
  def error; colorize("1;31") end
  def bold; colorize("1") end
  def status; colorize("1;34") end
  def titlecase
    self.gsub(/\w+/) do |word|
      word.capitalize
    end
  end
end

def sanitize_boolean(value)

end

desc "Convert XSLX"
task :convert, [:path] do |task, args|
  require 'simple_xlsx_reader'
  require 'csv'

  start = Time.now
  doc = SimpleXlsxReader.open(File.expand_path(args[:path]))
  datasheet = doc.sheets.first

  CSV.open("_data/data.csv", "wb") do |csv|
    csv << datasheet.headers
    datasheet.data.each { |row|
      csv << row
    }
  end

  FileUtils.cp('_data/data.csv', 'api/data.csv')

  puts "Finished in #{(Time.now - start).round(2)} seconds".status
end

desc "Build API"
task :build do

  require 'csv'
  require 'json'

  # Start the timer
  start = Time.now

  puts "Scrubbing invalid utf-8".bold

  f = "_data/data.csv"
  File.write(f, File.open(f).read.scrub(""))

  puts "Parsing `_data/data.csv`".bold

  # Array containing all data
  data = []

  CSV.foreach("_data/data.csv", :encoding => "iso-8859-1:utf-8", :headers => true, :header_converters => :symbol) do |row|
    f = row.fields

    # Convert data types (booleans)
    f.map! do |f|
      if f == "Yes"
        true
      elsif f == "No" 
        false
      elsif f == "NR"
        nil
      elsif f == "NONE"
        nil
      else
        f
      end
    end

    record = Hash[row.headers[0..-1].zip(f[0..-1])]

    # Convert data types
    record[:institution].to_s.upcase!
    record[:city].to_s.upcase!
    record[:state].to_s.upcase!
    record[:zip]                      = record[:zip].rjust(5, '0')            if record[:zip]
    record[:country].to_s.upcase!

    record[:cross]                    = record[:cross].to_i                   if record[:cross]
    record[:ope]                      = record[:ope].tr('"', '')              if record[:ope]
    record[:bah]                      = record[:bah].to_i                     if record[:bah]

    record[:gibill]                   = record[:gibill].to_i                  if record[:gibill]

    record[:grad_rate]                = record[:grad_rate].tr(',', '').to_f       if record[:grad_rate]
    record[:grad_rate_rank]           = record[:grad_rate_rank].to_i              if record[:grad_rate_rank]
    record[:default_rate]             = record[:default_rate].tr(',', '').to_f    if record[:default_rate]
    record[:avg_stu_loan_debt]        = record[:avg_stu_loan_debt].to_i           if record[:avg_stu_loan_debt]
    record[:avg_stu_loan_debt_rank]   = record[:avg_stu_loan_debt_rank].to_i      if record[:avg_stu_loan_debt_rank]
    record[:indicator_group]          = record[:indicator_group].to_i             if record[:indicator_group]

    record[:tuition_in_state]         = record[:tuition_in_state].to_i        if record[:tuition_in_state]
    record[:tuition_out_of_state]     = record[:tuition_out_of_state].to_i    if record[:tuition_out_of_state]
    record[:books]                    = record[:books].to_i                   if record[:books]
    record[:online_all]               = !!record[:online_all]

    record[:p911_tuition_fees]        = record[:p911_tuition_fees].tr(',', '').to_f       if record[:p911_tuition_fees]
    record[:p911_recipients]          = record[:p911_recipients].to_i                     if record[:p911_recipients]
    record[:p911_yellow_ribbon]       = record[:p911_yellow_ribbon].tr(',', '').to_f      if record[:p911_yellow_ribbon]
    record[:p911_yr_recipients]       = record[:p911_yr_recipients].to_i                  if record[:p911_yr_recipients]

    record[:complaints_facility_code]                     = record[:complaints_facility_code].to_i                      if record[:complaints_facility_code]
    record[:complaints_financial_by_fac_code]             = record[:complaints_financial_by_fac_code].to_i              if record[:complaints_financial_by_fac_code]
    record[:complaints_quality_by_fac_code]               = record[:complaints_quality_by_fac_code].to_i                if record[:complaints_quality_by_fac_code]
    record[:complaints_refund_by_fac_code]                = record[:complaints_refund_by_fac_code].to_i                 if record[:complaints_refund_by_fac_code]
    record[:complaints_marketing_by_fac_code]             = record[:complaints_marketing_by_fac_code].to_i              if record[:complaints_marketing_by_fac_code]
    record[:complaints_accreditation_by_fac_code]         = record[:complaints_accreditation_by_fac_code].to_i          if record[:complaints_accreditation_by_fac_code]
    record[:complaints_degree_requirements_by_fac_code]   = record[:complaints_degree_requirements_by_fac_code].to_i    if record[:complaints_degree_requirements_by_fac_code]
    record[:complaints_student_loans_by_fac_code]         = record[:complaints_student_loans_by_fac_code].to_i          if record[:complaints_student_loans_by_fac_code]
    record[:complaints_grades_by_fac_code]                = record[:complaints_grades_by_fac_code].to_i                 if record[:complaints_grades_by_fac_code]
    record[:complaints_credit_transfer_by_fac_code]       = record[:complaints_credit_transfer_by_fac_code].to_i        if record[:complaints_credit_transfer_by_fac_code]
    record[:complaints_transcript_by_fac_code]            = record[:complaints_transcript_by_fac_code].to_i             if record[:complaints_transcript_by_fac_code]
    record[:complaints_other_by_fac_code]                 = record[:complaints_other_by_fac_code].to_i                  if record[:complaints_other_by_fac_code]

    record[:complaints_main_campus_roll_up]               = record[:complaints_main_campus_roll_up].to_i                if record[:complaints_main_campus_roll_up]

    record[:complaints_financial_by_ope_id_do_not_sum]             = record[:complaints_financial_by_ope_id_do_not_sum].to_i              if record[:complaints_financial_by_ope_id_do_not_sum]
    record[:complaints_quality_by_ope_id_do_not_sum]               = record[:complaints_quality_by_ope_id_do_not_sum].to_i                if record[:complaints_quality_by_ope_id_do_not_sum]
    record[:complaints_refund_by_ope_id_do_not_sum]                = record[:complaints_refund_by_ope_id_do_not_sum].to_i                 if record[:complaints_refund_by_ope_id_do_not_sum]
    record[:complaints_marketing_by_ope_id_do_not_sum]             = record[:complaints_marketing_by_ope_id_do_not_sum].to_i              if record[:complaints_marketing_by_ope_id_do_not_sum]
    record[:complaints_accreditation_by_ope_id_do_not_sum]         = record[:complaints_accreditation_by_ope_id_do_not_sum].to_i          if record[:complaints_accreditation_by_ope_id_do_not_sum]
    record[:complaints_degree_requirements_by_ope_id_do_not_sum]   = record[:complaints_degree_requirements_by_ope_id_do_not_sum].to_i    if record[:complaints_degree_requirements_by_ope_id_do_not_sum]
    record[:complaints_student_loans_by_ope_id_do_not_sum]         = record[:complaints_student_loans_by_ope_id_do_not_sum].to_i          if record[:complaints_student_loans_by_ope_id_do_not_sum]
    record[:complaints_grades_by_ope_id_do_not_sum]                = record[:complaints_grades_by_ope_id_do_not_sum].to_i                 if record[:complaints_grades_by_ope_id_do_not_sum]
    record[:complaints_credit_transfer_by_ope_id_do_not_sum]       = record[:complaints_credit_transfer_by_ope_id_do_not_sum].to_i        if record[:complaints_credit_transfer_by_ope_id_do_not_sum]
    record[:complaints_transcript_by_ope_id_do_not_sum]            = record[:complaints_transcript_by_ope_id_do_not_sum].to_i             if record[:complaints_transcript_by_ope_id_do_not_sum]
    record[:complaints_other_by_ope_id_do_not_sum]                 = record[:complaints_other_by_ope_id_do_not_sum].to_i                  if record[:complaints_other_by_ope_id_do_not_sum]
    record[:complaints_jobs_by_ope_id_do_not_sum]                 = record[:complaints_jobs_by_ope_id_do_not_sum].to_i                  if record[:complaints_jobs_by_ope_id_do_not_sum]

    # Save row to array
    data.push record
  end

  puts "Writing `api/institutions.json`".bold

  # Array of only institutions, location, and their facility_code
  institutions = []

  data.each do |el|
    institutions.push Array[el[:facility_code], el[:institution],
                            el[:city], el[:state], el[:country]]
  end

  File.open("api/institutions.json", 'w') { |f| f.write(institutions.to_json) }

  puts "Writing institution data".bold

  data.each do |el|
    unless el[:facility_code] == nil
      dir_path = "api/#{el[:facility_code][0..2]}"
      FileUtils.mkdir_p dir_path
      File.open("#{dir_path}/#{el[:facility_code]}.json", 'w') { |f| f.write(JSON.pretty_generate(el)) }
    end
  end

  puts "Generating Indexes".bold

  system("python create_indexes.py")

  puts "Finished in #{(Time.now - start).round(2)} seconds".status
end

task :default => :build
