require 'test_helper'

class ServicesControllerTest < ActionController::TestCase
  test "should get flickr" do
    get :flickr
    assert_response :success
  end

end
