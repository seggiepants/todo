require 'rails_helper'
require 'jwt'

describe AuthenticationTokenService do
  describe '.encode' do
    USER_ID = 1
    let(:token) { described_class.encode(USER_ID) }
    it 'returns an authentication token' do
      decoded_token = JWT.decode(
        token, 
        described_class::HMAC_SECRET, 
        true, 
        { algorithm: described_class::ALGORITHM_TYPE })
      expect(decoded_token).to eq([
        {"user_id"=>USER_ID},
        {"alg"=>"HS256"}
      ])
    end
  end
end