require './spec_helper'

describe 'Ghostdriver' do
  $driver1 = nil
  $url     = 'http://localhost:4567/'
  $remote  = 'http://localhost:8910'

  describe 'Start' do
    it 'should start the session' do
        # $driver1 = Selenium::WebDriver.for(:phantomjs)
        $driver1 = Selenium::WebDriver.for(:chrome)
        #$driver1 = Selenium::WebDriver.for(:remote, :url=> $remote)
    end
  end

  describe 'Basic' do

    it 'should navigate to a new URL' do
      $driver1.get($url)
      element = $driver1.find_element(:name=>'q')
      element.clear
      element.send_keys 'Lucas'
      element['value'].should eq 'Lucas'
    end
  end
end