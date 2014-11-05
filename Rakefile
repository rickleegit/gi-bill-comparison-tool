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

  puts "Finished in #{(Time.now - start).round(2)} seconds".status
end

desc "Build API"
task :build do

  require 'csv'
  require 'json'

  # Start the timer
  start = Time.now

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
      else
        f
      end
    end

    # Convert data types
    # f[0] # facility_code
    f[1].to_s.upcase! # institution
    f[2].to_s.upcase! # city
    f[3].to_s.upcase! # state
    unless f[4] == nil; f[4] = f[4].rjust(5, '0') end # zip
    f[5].to_s.upcase! # country
    # f[6] # type
    unless f[7] == nil; f[7] = f[7].to_i  end # cross
    unless f[8] == nil; f[8].tr!('"', '') end # ope
    unless f[9] == nil; f[9] = f[9].to_i  end # bah
    # f[10] # poe
    # f[11] # yr
    unless f[12] == nil; f[12] = f[12].to_i end # gibill
    # f[13] # student_veteran
    # f[14] # student_veteran_link
    # f[15] # vetsuccess_name
    # f[16] # vetsuccess_email
    # f[17] # eight_keys
    # f[18] # correspondence
    # f[19] # flight
    unless f[20] == nil; f[20] = f[20].to_f end # grad_rate
    unless f[21] == nil; f[21] = f[21].to_i end # grad_rate_rank
    unless f[22] == nil; f[22] = f[22].to_f end # default_rate
    unless f[23] == nil; f[23] = f[23].to_i end # avg_stu_loan_debt
    unless f[24] == nil; f[24] = f[24].to_i end # avg_stu_loan_debt_rank
    unless f[25] == nil; f[25] = f[25].to_i end # indicator_group
    # f[26] # salary
    # f[27] # calendar
    unless f[28] == nil; f[28] = f[28].to_i end # tuition_in_state
    unless f[29] == nil; f[29] = f[29].to_i end # tuition_out_of_state
    unless f[30] == nil; f[30] = f[30] == "true" end # online_all
    unless f[31] == nil; f[31] = f[31].to_f end # p911_tuition_fees
    unless f[32] == nil; f[32] = f[32].to_i end # p911_recipients
    unless f[33] == nil; f[33] = f[33].to_f end # p911_yellow_ribbon
    unless f[34] == nil; f[34] = f[34].to_i end # p911_yr_recipients
    # f[35] # accredited
    # f[36] # accreditation_type
    # f[37] # accreditation_status
    unless f[38] == nil; f[38] = f[38].to_i end # complaints_facility_code
    unless f[39] == nil; f[39] = f[39].to_i end # complaints_main_campus_roll_up
    unless f[40] == nil; f[40] = f[40].to_i end # complaints_financial
    unless f[41] == nil; f[41] = f[41].to_i end # complaints_quality
    unless f[42] == nil; f[42] = f[42].to_i end # complaints_refund
    unless f[43] == nil; f[43] = f[43].to_i end # complaints_marketing
    unless f[44] == nil; f[44] = f[44].to_i end # complaints_accreditation
    unless f[45] == nil; f[45] = f[45].to_i end # complaints_degree_requirements
    unless f[46] == nil; f[46] = f[46].to_i end # complaints_student_loans
    unless f[47] == nil; f[47] = f[47].to_i end # complaints_grades
    unless f[48] == nil; f[48] = f[48].to_i end # complaints_credit_transfer
    unless f[49] == nil; f[49] = f[49].to_i end # complaints_jobs
    unless f[50] == nil; f[50] = f[50].to_i end # complaints_transcript
    unless f[51] == nil; f[51] = f[51].to_i end # complaints_other

    # Save row to array
    data.push Hash[row.headers[0..-1].zip(f[0..-1])]
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

  Dir.chdir("api") do
    system("python create_indexes.py")
  end

  puts "Finished in #{(Time.now - start).round(2)} seconds".status
end

task :default => :build
